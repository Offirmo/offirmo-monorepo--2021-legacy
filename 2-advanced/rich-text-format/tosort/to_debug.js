"use strict";

const MANY_SPACES = '                                 '

function indent(n) {
	return MANY_SPACES.slice(0, n * 2)
}

function debug_node_short($node) {
	const { $type, $content } = $node

	return `${$type}."${$content}"`
}

module.exports = {
	begin: () => console.log('⟩ [begin]'),
	end: () => console.log('⟨ [end]'),
	on_node_enter: ({$node, $id, depth}) => {
		console.log(indent(depth) + `⟩ [node] #${$id} ` + debug_node_short($node))
		const state = ''
		console.log(indent(depth) + `  [state="${state}"] after`)
		return state
	},
	on_node_exit: ({$id, state, $node, depth}) => {
		console.log(indent(depth) + `⟨ [node] #${$id} [state="${state}"]`)
		return state
	},
	on_concatenate_str: ({str, state, $node, depth}) => {
		console.log(indent(depth) + `+ [content=str] "${str}"`)
		console.log(indent(depth) + `  [state="${state}"] before`)
		state = state + str
		console.log(indent(depth) + `  [state="${state}"] after`)
		return state
	},
	on_concatenate_sub_node: ({sub_state, state, $node, depth}) => {
		console.log(indent(depth) + `+ [content=node] "${sub_state}"`)
		console.log(indent(depth) + `  [state="${state}"] before`)
		state = state + sub_state
		console.log(indent(depth) + `  [state="${state}"] after`)
		return state
	},
	on_sub_node_id: ({$id, state, $node, depth}) => {
		console.log(indent(depth) + `  [sub-node] #${$id}`)
		console.log(indent(depth) + `  [state="${state}"]`)
		return state
	},
	on_filter: ({$filter, sub_state, state, depth }) => {
		console.log(indent(depth) + `  [filter] "${$filter}" on "${sub_state}"`)
		console.log(indent(depth) + `  [state="${state}"]`)
		return state
	},
	on_class_before: ({$class, state, $node, depth }) => {
		console.log(indent(depth) + `  [⟩class] .${$class}`)
		console.log(indent(depth) + `  [state="${state}"]`)
		return state
	},
	on_class_after: ({$class, state, $node, depth }) => {
		console.log(indent(depth) + `  [⟨class] .${$class}`)
		console.log(indent(depth) + `  [state="${state}"]`)
		return state
	},
	on_type: ({$type, state, $node, depth}) => {
		console.log(indent(depth) + `  [type] "${$type}" ${$node.$classes}`)
		console.log(indent(depth) + `  [state="${state}"]`)
		return state
	},
}
