import memoize_one from 'memoize-one'
import {
	NodeType,
	OnConcatenateStringParams,
	OnConcatenateSubNodeParams, OnNodeExitParams,
	OnTypeParams,
	walk,
	WalkerCallbacks,
	WalkerReducer,
} from '../walk'
import { CheckedNode, Node } from '../types'

import { is_list, is_link, is_KVP_list, is_uuid_list } from './common'

const LIB = 'rich_text_to_html'

const MANY_TABS = '																																							'

export type Options = {}
export const DEFAULT_OPTIONS = {}

type State = {
	sub_nodes: CheckedNode[]
	str: string
}

function indent(n: number): string {
	return MANY_TABS.slice(0, n)
}

const NODE_TYPE_TO_HTML_ELEMENT: { [k: string]: string } = {
	// will default to own tag if not in this list (ex. strong => strong)
	[NodeType.weak]: 'span',
	[NodeType.heading]: 'h3',
	[NodeType.inline_fragment]: 'span',
	[NodeType.block_fragment]: 'div',
}

const warn_kvp = memoize_one(() => console.warn(`${LIB} TODO KVP`))

const on_concatenate_sub_node: WalkerReducer<State, OnConcatenateSubNodeParams<State>, Options> = ({$node, state, sub_state}) => {
	state.sub_nodes.push($node)
	state.str = state.str + sub_state.str
	return state
}

const on_node_exit: WalkerReducer<State, OnNodeExitParams<State>, Options> = ({state, $node, depth}) => {
	const { $type, $classes, $sub, $hints } = $node
	const $sub_node_count = Object.keys($sub).length

	//$type: NodeType, str
	//}: string, $classes: string[], $sub_node_count: number, depth: number): string {

	if ($type === 'br') {
		state.str = '<br/>\n'
		return state
	}

	if ($type === 'hr') {
		state.str = '\n<hr/>\n'
		return state
	}

	let result = ''
	let is_inline = false
	const classes = [...$classes]

	switch($type) {
		case 'strong':
		case 'em':
			is_inline = true
			break
		case 'weak':
			classes.push('o⋄colorꘌsecondary')
			is_inline = true
			break
		case 'inline_fragment':
			//classes.push('o⋄rich-text⋄inline')
			is_inline = true
			break
		default:
			break
	}

	if (!is_inline)
		result += '\n' + indent(depth)

	const element: string = NODE_TYPE_TO_HTML_ELEMENT[$type] || $type

	if (is_list($node)) {
		classes.push('o⋄rich-text⋄list')

		switch($hints.bullets_style) {
			case 'none':
				classes.push('o⋄rich-text⋄list--no-bullet')
				break

			default:
				break
		}

		if (is_uuid_list($node)) {
			//console.log(`${LIB} seen uuid list`)
			classes.push('o⋄rich-text⋄list--interactive')
		}

		if (is_KVP_list($node)) {
			classes.push('o⋄rich-text⋄list--no-bullet')
			// TODO rewrite completely
			warn_kvp()
		}
	}

	result += `<${element}`
	if (classes.length)
		result += ` class="${classes.join(' ')}"`
	result += '>' + state.str + ($sub_node_count ? '\n' + indent(depth) : '') + `</${element}>`

	if (is_link($node))
		result = `<a href="${$hints.href}" target="_blank">${result}</a>`

	// for demo only
	if ($hints.uuid)
		result = `<button class="o⋄button--inline o⋄rich-text⋄interactive" ${$hints.uuid}">${result}</button>`

	state.str = result
	return state
}

const callbacks: Partial<WalkerCallbacks<State, Options>> = {
	on_node_enter: () => ({
		sub_nodes: [],
		str: '',
	}),
	on_concatenate_str: ({state, str}: OnConcatenateStringParams<State>) => {
		state.str += str
		return state
	},
	on_concatenate_sub_node,
	on_node_exit,
}

function to_html($doc: Node, options: Options = DEFAULT_OPTIONS): string {
	return '<div class="o⋄rich-text o⋄children-spacing⁚flow">\n	' + walk<State, Options>($doc, callbacks, options).str + '\n</div>\n'
}

export { callbacks, to_html }
