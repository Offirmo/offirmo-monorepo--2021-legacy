import { Node, CheckedNode } from '../types'
import { NODE_TYPE_TO_DISPLAY_MODE } from '../consts'
import {
	OnConcatenateStringParams,
	OnConcatenateSubNodeParams,
	OnNodeEnterParams, OnNodeExitParams,
	walk,
	WalkerCallbacks,
	WalkerReducer,
} from '../walk'

import { is_link, is_KVP_list } from './common'

export type Options = {
	style: 'basic' | 'advanced' | 'markdown'
}
export const DEFAULT_OPTIONS: Options = {
	style: 'advanced',
}

type State = {
	sub_nodes: CheckedNode[]
	starts_with_block: boolean
	ends_with_block: boolean
	margin_top: number
	margin_bottom: number
	str: string
}
const DEFAULT_STATE: State = Object.freeze({
	sub_nodes: [],
	starts_with_block: false,
	ends_with_block: false,
	margin_top: 0,
	margin_bottom: 0,
	str: '',
})

const on_node_exit: WalkerReducer<State, OnNodeExitParams<State>, Options> = ({state, $node, depth}, {style}) => {
	//console.log('[on_type]', { $type, state })

	switch ($node.$type) {
		case 'br':
			state.ends_with_block = true
			break

		default:
			break
	}

	if (style === 'markdown') {
		switch ($node.$type) {
			case 'heading':
				state.str = `### ${state.str}`
				state.margin_top = Math.max(state.margin_top, 1)
				state.margin_bottom = Math.max(state.margin_bottom, 1)
				break

			case 'strong':
				state.str = `**${state.str}**`
				break

			case 'weak':
				// how?
				// no change...
				break

			case 'em':
				state.str = `_${state.str}_`
				break

			case 'hr':
				state.str = '---'
				break

			default:
				break
		}

		if (is_link($node))
			state.str = `[${state.str}](${$node.$hints.href})`
	}
	else {
		switch ($node.$type) {
			case 'heading':
				state.margin_top = Math.max(state.margin_top, 1)
				break

			case 'hr':
				state.str = '------------------------------------------------------------'
				break

			default:
				break
		}

		if (style === 'advanced' && is_KVP_list($node)) {
			// rewrite completely to a better-looking one
			const key_value_pairs: [string, string][] = []

			let max_key_length = 0
			let max_value_length = 0
			state.sub_nodes.forEach(li_node => {
				//console.log({li_node})
				const kv_node = li_node.$sub.content! as CheckedNode

				const key_node = kv_node.$sub.key!
				const value_node = kv_node.$sub.value!

				const key_text = to_text(key_node)
				const value_text = to_text(value_node)

				max_key_length = Math.max(max_key_length, key_text.length)
				max_value_length = Math.max(max_value_length, value_text.length)

				key_value_pairs.push([key_text, value_text])
			})

			state.str = key_value_pairs.map(([key_text, value_text]) => {
				return key_text.padEnd(max_key_length + 1, '.') + value_text.padStart(max_value_length + 1, '.')
			}).join('\n')
		}
	}

	if (NODE_TYPE_TO_DISPLAY_MODE[$node.$type] === 'block') {
		state.starts_with_block = true
		state.ends_with_block = true
	}

	return state
}

const on_concatenate_sub_node: WalkerReducer<State, OnConcatenateSubNodeParams<State>, Options> = ({state, sub_state, $node, $id, $parent_node}, {style}) => {
	let sub_str = sub_state.str
	let sub_starts_with_block = sub_state.starts_with_block

	state.sub_nodes.push($node)

	switch ($parent_node.$type) {
		case 'ul': {
		// automake sub-state a ul > li
			const bullet: string = (() => {
				if ($parent_node.$hints.bullets_style === 'none' && style === 'advanced')
					return ''

				return '- '
			})()
			sub_starts_with_block = true
			sub_str = bullet + sub_str
			break
		}
		case 'ol': {
		// automake sub-state a ol > li
			const bullet: string = (() => {
				if (style === 'markdown')
					return `${$id}. `

				return `${(' ' + $id).slice(-2)}. `
			})()
			sub_starts_with_block = true
			sub_str = bullet + sub_str
			break
		}
		default:
			break
	}

	/*console.log('on_concatenate_sub_node()', {
		sub_node: $node,
		sub_state: {
			...sub_state,
				str: sub_str,
				starts_with_block: sub_starts_with_block,
		},
		state: JSON.parse(JSON.stringify(state)),
	})*/

	if (state.str.length === 0) {
		// we are at start
		if (sub_state.starts_with_block) {
			// propagate start
			state.starts_with_block = true
			state.margin_top = Math.max(state.margin_top, sub_state.margin_top)
		}
	}
	else {
		if (state.ends_with_block || sub_starts_with_block) {
			state.str += ''.padStart(Math.max(state.margin_bottom, sub_state.margin_top) + 1,'\n')
		}
	}

	state.str += sub_str

	state.ends_with_block = sub_state.ends_with_block

	return state
}

const callbacks: Partial<WalkerCallbacks<State, Options>> = {
	on_node_enter: () => ({
		...DEFAULT_STATE,
		sub_nodes: [],
	}),
	on_concatenate_str: ({state, str}: OnConcatenateStringParams<State>) => {
		//console.log('on_concatenate_str()', {str, state: JSON.parse(JSON.stringify(state)),})
		if (state.ends_with_block) {
			state.str += ''.padStart(state.margin_bottom + 1,'\n')
			state.ends_with_block = false
			state.margin_bottom = 0
		}
		state.str += str
		return state
	},
	on_concatenate_sub_node,
	on_node_exit,
}

function to_text(
	$doc: Node,
	options: Options = DEFAULT_OPTIONS,
	callback_overrides: Partial<WalkerCallbacks<State, Options>> = {},
): string {
	return walk<State, Options>($doc, {
		...callbacks,
		...callback_overrides,
	}, options).str
}

export {
	callbacks,
	to_text,
}

// TODO capitalize
