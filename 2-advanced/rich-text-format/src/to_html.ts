import { WalkerCallbacks, WalkerReducer, AnyParams } from './walk'


import stylize_string  from 'chalk'


const MANY_TABS = '																																							'

function indent(n: number): string {
	return MANY_TABS.slice(0, n)
}


function apply_type($type: string, str: string, $classes: string[], $sub_node_count: number, depth: number): string {
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

	result += `<${$type}`
	if ($classes.length)
		result += ` class="${$classes.join(' ')}"`
	result += '>' + str + ($sub_node_count ? '\n' + indent(depth) : '') + `</${$type}>`

	return result
}

const on_concatenate_sub_node: WalkerReducer<string, AnyParams<string>> = ({state, sub_state}) => {
	return state + sub_state
}

const callbacks: Partial<WalkerCallbacks<string>> = {
	on_node_enter: () => '',
	on_concatenate_str: ({state, str}) => state + str,
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
