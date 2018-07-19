import {NodeType, OnConcatenateStringParams, OnConcatenateSubNodeParams, WalkerCallbacks, WalkerReducer} from './walk'

const MANY_TABS = '																																							'

type State = string

function indent(n: number): string {
	return MANY_TABS.slice(0, n)
}

const NODE_TYPE_TO_HTML_ELEMENT: { [k: string]: string } = {
	[NodeType.heading]: 'h3',
	[NodeType.inline_fragment]: 'span',
	[NodeType.block_fragment]: 'div',
}

function apply_type($type: NodeType, str: string, $classes: string[], $sub_node_count: number, depth: number): string {
	if ($type === 'br')
		return '<br/>\n'

	if ($type === 'hr')
		return '\n<hr/>\n'

	let is_inline = false
	switch($type) {
		case 'strong':
		case 'em':
		case 'span':
			is_inline = true
			break
		default:
			break;
	}

	let result = ''
	if (!is_inline)
		result += '\n' + indent(depth)

	const element: string = NODE_TYPE_TO_HTML_ELEMENT[$type] || $type

	result += `<${element}`
	if ($classes.length)
		result += ` class="${$classes.join(' ')}"`
	result += '>' + str + ($sub_node_count ? '\n' + indent(depth) : '') + `</${element}>`

	return result
}

const on_concatenate_sub_node: WalkerReducer<State, OnConcatenateSubNodeParams<State>> = ({state, sub_state}) => {
	return state + sub_state
}

const callbacks: Partial<WalkerCallbacks<State>> = {
	on_node_enter: () => '',
	on_concatenate_str: ({state, str}: OnConcatenateStringParams<State>) => state + str,
	on_concatenate_sub_node,
	on_type: ({state: str, $type, $node: {$classes, $sub}, depth}) =>
		apply_type(
			$type,
			str,
			$classes,
			Object.keys($sub).length,
			depth
		),
}

export { callbacks }
