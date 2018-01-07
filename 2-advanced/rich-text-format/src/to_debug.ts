import {
	NodeType,
	CheckedNode,
	Node,
} from './types'
import { WalkerCallbacks, BaseParams, WalkerReducer, AnyParams } from './walk'

const MANY_SPACES = '                                                                                                '

function indent(n: number) {
	return MANY_SPACES.slice(0, n * 2)
}

////////////////////////////////////

function debug_node_short($node: CheckedNode) {
	const { $type, $content } = $node

	return `${$type}."${$content}"`
}

////////////////////////////////////

const on_root_enter = () => {
	console.log('⟩ [on_root_enter]')
}
const on_root_exit = ({state}: BaseParams<string>): string => {
	console.log('⟨ [on_root_exit]')
	console.log(`  [state="${state}"]`)
	return state
}

const on_node_enter: WalkerReducer<string, AnyParams<string>> = ({$node, $id, depth}) => {
	console.log(indent(depth) + `⟩ [on_node_enter] #${$id} ` + debug_node_short($node))
	const state = ''
	console.log(indent(depth) + `  [state="${state}"] (init)`)
	return state
}

const on_node_exit: WalkerReducer<string, AnyParams<string>> = ({$node, $id, state, depth}) => {
	console.log(indent(depth) + `⟨ [on_node_exit] #${$id}`)
	console.log(indent(depth) + `  [state="${state}"]`)

	return state
}


// when walking inside the content
const on_concatenate_str: WalkerReducer<string, AnyParams<string>> = ({str, state, $node, depth,}) => {
	console.log(indent(depth) + `+ [on_concatenate_str] "${str}"`)
	state = state + str
	console.log(indent(depth) + `  [state="${state}"]`)
	return state
}

const on_concatenate_sub_node: WalkerReducer<string, AnyParams<string>> = ({state, sub_state, depth, $id, $parent_node}) => {
	console.log(indent(depth) + `+ [on_concatenate_sub_node] "${sub_state}"`)
	state = state + sub_state
	console.log(indent(depth) + `  [state="${state}"]`)
	return state
}

const on_filter: WalkerReducer<string, AnyParams<string>> = ({$filter, $filters, state, $node, depth}) => {
	console.log(indent(depth) + `  [on_filter] "${$filter}`)
	return state
}

const on_class_before: WalkerReducer<string, AnyParams<string>> = ({$class, state, $node, depth}) => {
	console.log(indent(depth) + `  [⟩on_class_before] .${$class}`)
	return state
}
const on_class_after: WalkerReducer<string, AnyParams<string>> = ({$class, state, $node, depth}) => {
	console.log(indent(depth) + `  [⟨on_class_after] .${$class}`)
	return state
}

const on_type: WalkerReducer<string, AnyParams<string>> = ({$type, state, $node, depth}) => {
	console.log(indent(depth) + `  [on_type] "${$type}" ${$node.$classes}`)
	return state
}

////////////////////////////////////

const callbacks: Partial<WalkerCallbacks<string>> = {
	on_root_enter,
	on_root_exit,
	on_node_enter,
	on_node_exit,
	on_concatenate_str,
	on_concatenate_sub_node,
	/*
	on_sub_node_id: ({$id, state, $node, depth}) => {
		console.log(indent(depth) + `  [sub-node] #${$id}`)
		console.log(indent(depth) + `  [state="${state}"]`)
		return state
	},
	*/
	on_filter,
	on_class_before,
	on_class_after,
	on_type,
	on_type_br: ({state}: {state: any}) => {
		if (typeof state === 'string')
			return state + '{{br}}'
		return state
	},
	on_type_hr: ({state}: {state: any}) => {
		if (typeof state === 'string')
			return state + '{{hr}}'
		return state
	},
}

export { callbacks }
