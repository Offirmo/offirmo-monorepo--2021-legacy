import { LIB } from './consts'

import {
	NodeType,
	CheckedNode,
	Node,
} from './types'

import { normalize_node } from './utils'



export interface BaseParams<State> {
	state: State
	$node: CheckedNode
	depth: number
}
export interface OnNodeEnterParams {
	$id: string
	$node: CheckedNode
	depth: number
}
export interface OnNodeExitParams<State> extends BaseParams<State> {
	$id: string
}
export interface OnRootExitParams<State> extends BaseParams<State> {
}
export interface OnConcatenateStringParams<State> extends BaseParams<State> {
	str: string
}
export interface OnConcatenateSubNodeParams<State> extends BaseParams<State> {
	sub_state: State
	$id: string
	$parent_node: CheckedNode
}
export interface OnFilterParams<State> extends BaseParams<State> {
	$filter: string
	$filters: string[]
}
export interface OnClassParams<State> extends BaseParams<State> {
	$class: string
}
export interface OnTypeParams<State> extends BaseParams<State> {
	$type: NodeType
	$parent_node?: CheckedNode
}

interface WalkerReducer<State, P extends BaseParams<State>, RenderingOptions> {
	(params: P, options: RenderingOptions): State
}

interface WalkerCallbacks<State, RenderingOptions> {
	on_root_enter(options: RenderingOptions): void,
	on_root_exit(params: OnRootExitParams<State>, options: RenderingOptions): any,
	on_node_enter(params: OnNodeEnterParams, options: RenderingOptions): State,
	on_node_exit: WalkerReducer<State, OnNodeExitParams<State>, RenderingOptions>,
	on_concatenate_str: WalkerReducer<State, OnConcatenateStringParams<State>, RenderingOptions>,
	on_concatenate_sub_node: WalkerReducer<State, OnConcatenateSubNodeParams<State>, RenderingOptions>,
	on_filter: WalkerReducer<State, OnFilterParams<State>, RenderingOptions>,
	on_filter_Capitalize: WalkerReducer<State, OnFilterParams<State>, RenderingOptions>,
	on_class_before: WalkerReducer<State, OnClassParams<State>, RenderingOptions>,
	on_class_after: WalkerReducer<State, OnClassParams<State>, RenderingOptions>,
	on_type: WalkerReducer<State, OnTypeParams<State>, RenderingOptions>,

	// two specials
	on_type_hr?: WalkerReducer<State, OnTypeParams<State>, RenderingOptions>,
	on_type_br?: WalkerReducer<State, OnTypeParams<State>, RenderingOptions>,

	// hard to express but allowed
	[on_fiter_or_type: string]: any
	//[on_filter_x: string]: WalkerReducer<State, OnFilterParams<State>>,
	//[on_type_x: string]: WalkerReducer<State, OnTypeParams<State>>,
}

function get_default_callbacks<State, RenderingOptions = any>(): WalkerCallbacks<State, RenderingOptions> {
	function nothing(): void {}
	function identity({state}: {state: State}): State {
		return state
	}

	return {
		on_root_enter: nothing,
		on_root_exit: identity,
		on_node_enter: () => { throw new Error('Please define on_node_enter()!') },
		on_node_exit: identity,
		on_concatenate_str: identity,
		on_concatenate_sub_node: identity,
		on_filter: identity,
		on_filter_Capitalize: ({state}: {state: State}) => {

			// generic processing that works for text, ansi, React...
			const generic_state = state as any
			if (generic_state && typeof generic_state.str === 'string') {
				//console.log(`${LIB} auto capitalizing...`, state)
				const str = '' + generic_state.str
				return {
					...(generic_state as any),
					str: str[0].toUpperCase() + str.slice(1),
				} as State
			}

			return state
		},
		on_class_before: identity,
		on_class_after: identity,
		on_type: identity,
	}
}

const SUB_NODE_BR: Node = {
	$type: 'br',
}

const SUB_NODE_HR: Node = {
	$type: 'hr',
}


function walk_content<State, RenderingOptions>(
	$node: CheckedNode,
	callbacks: WalkerCallbacks<State, RenderingOptions>,
	state: State,
	depth: number,
	options: RenderingOptions,
) {
	const { $content, $sub: $sub_nodes } = $node
	const split1 = $content.split('{{')

	const initial_str: string = split1.shift()!
	if (initial_str)
		state = callbacks.on_concatenate_str({
			str: initial_str,
			state,
			$node,
			depth,
		}, options)

	state = split1.reduce((state, paramAndText) => {
		const split2 = paramAndText.split('}}')
		if (split2.length !== 2)
			throw new Error(`${LIB}: syntax error in content "${$content}", unmatched {{}}!`)

		const [ sub_node_id, ...$filters ] = split2.shift()!.split('|')

		let $sub_node = $sub_nodes[sub_node_id]

		if (!$sub_node && sub_node_id === 'br')
			$sub_node = SUB_NODE_BR

		if (!$sub_node && sub_node_id === 'hr')
			$sub_node = SUB_NODE_HR

		if (!$sub_node)
			throw new Error(`${LIB}: syntax error in content "${$content}", it's referring to an unknown sub-node "${sub_node_id}"!`)

		let sub_state = walk($sub_node, callbacks, options, {
			$parent_node: $node,
			$id: sub_node_id,
			depth: depth + 1,
		})

		//console.log('[filters', $filters, '])
		sub_state = $filters.reduce(
			(state, $filter) => {
				const fine_filter_cb_id = `on_filter_${$filter}`
				//console.log({fine_filter_cb_id})
				const fine_filter_callback = callbacks[fine_filter_cb_id] as WalkerReducer<State, OnFilterParams<State>, RenderingOptions>
				if (fine_filter_callback)
					state = fine_filter_callback({
						$filter,
						$filters,
						state,
						$node,
						depth,
					}, options)

				return callbacks.on_filter({
					$filter,
					$filters,
					state,
					$node,
					depth,
				}, options)
			},
			sub_state,
		)

		// Should we detect unused $subnodes?
		// NO it's convenient (ex. Oh-my-rpg) to over-set subnodes
		// and set a content which may or may not use them.

		state = callbacks.on_concatenate_sub_node({
			sub_state,
			$id: sub_node_id,
			$parent_node: $node,
			state,
			$node: normalize_node($sub_node),
			depth,
		}, options)

		if (split2[0])
			state = callbacks.on_concatenate_str({
				str: split2[0],
				state,
				$node,
				depth,
			}, options)

		return state
	}, state)

	return state
}


function walk<State, RenderingOptions>(
	$raw_node: Readonly<Node>,
	raw_callbacks: Readonly<Partial<WalkerCallbacks<State, RenderingOptions>>>,
	options: Readonly<RenderingOptions> = {} as any,
	// internal opts when recursing:
	{
		$parent_node,
		$id = 'root',
		depth = 0,
	}: {
	$parent_node?: Readonly<CheckedNode>,
	$id?: string,
	depth?: number,
	} = {},
) {

	const $node = normalize_node($raw_node)
	const {
		$type,
		$classes,
		$sub: $sub_nodes,
	} = $node

	// quick check
	if (!Object.keys(raw_callbacks).every(k => k.startsWith('on_')))
		console.warn(`${LIB} Bad callbacks, check the API!`)
	let callbacks: WalkerCallbacks<State, RenderingOptions> = raw_callbacks as any as WalkerCallbacks<State, RenderingOptions>
	const isRoot = !$parent_node
	if (isRoot) {
		callbacks = {
			...get_default_callbacks<State, RenderingOptions>(),
			...callbacks,
		}
		callbacks.on_root_enter(options)
	}

	let state = callbacks.on_node_enter({ $node, $id, depth }, options)

	// TODO class begin / start ?

	state = $classes.reduce(
		(state, $class) => callbacks.on_class_before({
			$class,
			state,
			$node,
			depth,
		}, options),
		state,
	)

	if ($type === 'ul' || $type === 'ol') {
		// special case of sub-content
		const sorted_keys = Object.keys($sub_nodes).sort()
		//console.log('walk ul/ol', sorted_keys)
		sorted_keys.forEach(key => {
			// I've been bitten by that...
			const number = Number(key)
			if (key === number.toString()) {
				console.warn(
					`in sub-node '${$id}', the ul/ol key '${key}' suspiciously looks like a number. Beware of auto sorting!`,
					{
						$node,
						sorted_keys,
					},
				)
			}
		})
		sorted_keys.forEach(key => {
			const $sub_node: Node = {
				$type: NodeType.li,
				$content: '{{content}}',
				$sub: {
					content: $sub_nodes[key],
				},
			}
			const sub_state = walk( $sub_node, callbacks, options, {
				$parent_node: $node,
				depth: depth +1,
				$id: key,
			})
			state = callbacks.on_concatenate_sub_node({
				state,
				sub_state,
				$id: key,
				$node: normalize_node($sub_node),
				$parent_node: $node,
				depth,
			}, options)
		})
	}
	else
		state = walk_content($node, callbacks, state, depth, options)

	state = $classes.reduce(
		(state, $class) => callbacks.on_class_after({ $class, state, $node, depth }, options),
		state,
	)

	const fine_type_cb_id = `on_type_${$type}`
	const fine_type_callback = callbacks[fine_type_cb_id] as WalkerReducer<State, OnTypeParams<State>, RenderingOptions>
	if (fine_type_callback)
		state = fine_type_callback({ $type, $parent_node, state, $node, depth }, options)
	state = callbacks.on_type({ $type, $parent_node, state, $node, depth }, options)

	state = callbacks.on_node_exit({$node, $id, state, depth}, options)

	if (!$parent_node)
		state = callbacks.on_root_exit({state, $node, depth: 0}, options)

	return state
}

export {
	NodeType,
	CheckedNode,
	Node,
	WalkerReducer,
	WalkerCallbacks,
	walk,
}
