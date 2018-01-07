import { LIB_ID as LIB, SCHEMA_VERSION } from './consts'

import {
	NodeType,
	CheckedNode,
	Node,
} from './types'

import {
	normalize_node,
} from './utils'


// TODO better
interface BaseParams<State> {
	state: State,
	$node: CheckedNode,
	depth: number
}

interface WalkerReducer<State, P extends BaseParams<State>> {
	(params: P): State
}

interface AnyParams<State> extends BaseParams<State> {
	[x: string]: any
}

interface WalkerCallbacks<State> {
	on_root_enter(): void,
	on_root_exit(params: BaseParams<State>): any,
	on_node_enter: any, // TODO
	// TODO better types
	on_node_exit: WalkerReducer<State, AnyParams<State>>,
	on_concatenate_str: WalkerReducer<State, AnyParams<State>>,
	on_concatenate_sub_node: WalkerReducer<State, AnyParams<State>>,
	//on_sub_node_id: WalkerReducer<State, AnyParams<State>>,
	on_filter: WalkerReducer<State, AnyParams<State>>,
	on_filter_Capitalize: WalkerReducer<State, AnyParams<State>>,
	on_class_before: WalkerReducer<State, AnyParams<State>>,
	on_class_after: WalkerReducer<State, AnyParams<State>>,
	on_type: WalkerReducer<State, AnyParams<State>>,
	[on_x: string]: any,
}

function get_default_callbacks<State>(): WalkerCallbacks<State> {
	function nothing(): void {}
	function identity({state}: {state: State}): State {
		return state
	}

	return {
		on_root_enter: nothing,
		on_root_exit: identity,
		on_node_enter: identity,
		on_node_exit: identity,
		on_concatenate_str: identity,
		on_concatenate_sub_node: identity,
		on_sub_node_id: identity,
		on_filter: identity,
		on_filter_Capitalize: ({state}: {state: State}) => {
			if (typeof state === 'string' && state) {
				//console.log(`${LIB} auto capitalizing...`, state)
				const str = '' + state
				return str[0].toUpperCase() + str.slice(1) as any as State
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


function walk_content<State>(
	$node: CheckedNode,
	callbacks: WalkerCallbacks<State>,
	state: State,
	depth: number
) {
	const { $content, $sub: $sub_nodes } = $node
	const split1 = $content.split('{{')

	state = callbacks.on_concatenate_str({
		str: split1.shift(),
		state,
		$node,
		depth,
	})

	state = split1.reduce((state, paramAndText) => {
		const split2 = paramAndText.split('}}')
		if (split2.length !== 2)
			throw new Error(`${LIB}: syntax error in content "${$content}"!`)

		const [ sub_node_id, ...$filters ] = split2.shift()!.split('|')
		/*
		state = callbacks.on_sub_node_id({
			$id: sub_node_id,
			state,
			$node,
			depth,
		})
		*/

		let $sub_node = $sub_nodes[sub_node_id]

		if (!$sub_node && sub_node_id === 'br')
			$sub_node = SUB_NODE_BR

		if (!$sub_node && sub_node_id === 'hr')
			$sub_node = SUB_NODE_HR

		if (!$sub_node)
			throw new Error(`${LIB}: syntax error in content "${$content}", it's referring to an unknown sub-node "${sub_node_id}"!`)

		let sub_state = walk($sub_node, callbacks, {
			$parent_node: $node,
			$id: sub_node_id,
			depth: depth + 1,
		})

		sub_state = $filters.reduce(
			(state, $filter) => {
				const fine_filter_cb = `on_filter_${$filter}`
				if (callbacks[fine_filter_cb])
					return callbacks[fine_filter_cb]({
						$filter,
						$filters,
						state,
						$node,
						depth
					})
				return callbacks.on_filter({
					$filter,
					$filters,
					state,
					$node,
					depth,
				})
			},
			sub_state,
		)

		// TODO detect unused $subnodes?

		state = callbacks.on_concatenate_sub_node({
			sub_state,
			$id: sub_node_id,
			$parent_node: $node,
			state,
			$node: normalize_node($sub_node),
			depth,
		})

		state = callbacks.on_concatenate_str({
			str: split2[0],
			state,
			$node,
			depth,
		})

		return state
	}, state)

	return state
}


function walk<State>(
	$raw_node: Node,
	raw_callbacks: Partial<WalkerCallbacks<State>>,
	// internal opts when recursing:
	{
		$parent_node,
		$id = 'root',
		depth = 0,
	}: {
		$parent_node?: CheckedNode,
		//$parent_state?: State, TODO ?
		$id?: string,
		depth?: number,
	} = {}
) {
	const $node = normalize_node($raw_node)
	const {
		$type,
		$classes,
		$sub: $sub_nodes,
	} = $node

	let callbacks: WalkerCallbacks<State> = raw_callbacks as any as WalkerCallbacks<State>
	const isRoot = !$parent_node
	if (isRoot) {
		callbacks = {
			...get_default_callbacks<State>(),
			...callbacks,
		}
		callbacks.on_root_enter()
	}

	let state = callbacks.on_node_enter({ $node, $id, depth })

	// TODO class begin / start ?

	state = $classes.reduce(
		(state, $class) => callbacks.on_class_before({
			$class,
			state,
			$node,
			depth
		}),
		state
	)

	if ($type === 'ul' || $type === 'ol') {
		const sorted_keys = Object.keys($sub_nodes).sort()
		sorted_keys.forEach(key => {
			const $sub_node: Node = {
				$type: NodeType.li,
				$content: `{{${key}}}`,
				$sub: {
					[key]: $sub_nodes[key]
				}
			}
			let sub_state = walk( $sub_node, callbacks, {
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
			})
		})
	}
	else
		state = walk_content($node, callbacks, state, depth)

	state = $classes.reduce(
		(state, $class) => callbacks.on_class_after({ $class, state, $node, depth }),
		state
	)

	const fine_type_cb = `on_type_${$type}`
	if (callbacks[fine_type_cb])
		state = callbacks[fine_type_cb]({ $type, state, $node, depth })
	else
		state = callbacks.on_type({ $type, state, $node, depth })

	state = callbacks.on_node_exit({$node, $id, state, depth})

	if (!$parent_node)
		state = callbacks.on_root_exit({state, $node, depth: 0})

	return state
}

export {
	NodeType,
	CheckedNode,
	Node,
	BaseParams,
	AnyParams,
	WalkerReducer,
	WalkerCallbacks,
	walk,
}
