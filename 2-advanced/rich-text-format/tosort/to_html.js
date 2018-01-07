"use strict";


const MANY_TABS = '																													'

function indent(n) {
	return MANY_TABS.slice(0, n)
}


function apply_type({$type, str, $classes, $sub_node_count, depth}) {
	if ($type === 'br')
		return '<br/>\n'

	if ($type === 'hr')
		return '\n<hr/>\n'

	let result = '\n' + indent(depth) + `<${$type}`
	if ($classes.length)
		result += ` class="${$classes.join(' ')}"`
	result += '>' + str + ($sub_node_count ? '\n' + indent(depth) : '') + `</${$type}>`

	return result
}



function on_concatenate_sub_node({state, sub_state, id, $node}) {
	/*if ($node.$type === 'li')
		return state + '\n' + sub_state + '\n'*/

	return state + sub_state
}



module.exports = {
	on_node_enter: () => '',
	on_concatenate_str: ({state, str}) => state + str,
	on_concatenate_sub_node,
	on_type: ({state: str, $type, $node: {$classes, $sub_node_count}, depth}) => apply_type({$type, str, $classes, $sub_node_count, depth}),
}

