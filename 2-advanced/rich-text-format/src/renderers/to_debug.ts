/* eslint-disable no-console */
import {
	CheckedNode,
	Node,
} from '../types'

import {
	WalkerCallbacks,
	WalkerReducer,
	OnRootExitParams,
	OnNodeEnterParams,
	OnNodeExitParams, OnConcatenateStringParams, OnConcatenateSubNodeParams, OnFilterParams,
	OnClassParams,
	OnTypeParams,
	walk,
} from '../walk'

const MANY_SPACES = '                                                                                                '

function indent(n: number) {
	return (console.groupCollapsed || console.group)
		? ''
		: MANY_SPACES.slice(0, n * 2)
}

////////////////////////////////////

function debug_node_short($node: CheckedNode) {
	const { $type, $content } = $node

	return `${$type}."${$content}"`
}

////////////////////////////////////

export type Options = {}
export const DEFAULT_OPTIONS = {}
type State = string

const consoleGroupStart: Function = (console.groupCollapsed || console.group || console.log).bind(console)
const consoleGroupEnd: Function = (console.groupEnd || console.log).bind(console)

const on_root_enter = () => {
	consoleGroupStart('⟩ [on_root_enter]')
}
const on_root_exit = ({state}: OnRootExitParams<State>): State => {
	console.log('⟨ [on_root_exit]')
	console.log(`  [state="${state}"]`)
	consoleGroupEnd()
	return state
}

const on_node_enter = ({$node, $id, depth}: OnNodeEnterParams): State => {
	consoleGroupStart(indent(depth) + `⟩ [on_node_enter] #${$id}/` + debug_node_short($node))
	const state = ''
	console.log(indent(depth) + `  [state="${state}"] (init)`)
	return state
}

const on_node_exit: WalkerReducer<State, OnNodeExitParams<State>, Options> = ({$node, $id, state, depth}) => {
	console.log(indent(depth) + `⟨ [on_node_exit] #${$id}`)
	console.log(indent(depth) + `  [state="${state}"]`)
	consoleGroupEnd()

	return state
}


// when walking inside the content
const on_concatenate_str: WalkerReducer<State, OnConcatenateStringParams<State>, Options> = ({str, state, $node, depth}) => {
	console.log(indent(depth) + `+ [on_concatenate_str] "${str}"`)
	state = state + str
	console.log(indent(depth) + `  [state="${state}"]`)
	return state
}

const on_concatenate_sub_node: WalkerReducer<State, OnConcatenateSubNodeParams<State>, Options> = ({state, sub_state, depth, $id, $parent_node}) => {
	console.log(indent(depth) + `+ [on_concatenate_sub_node] "${sub_state}"`)
	state = state + sub_state
	console.log(indent(depth) + `  [state="${state}"]`)
	return state
}

const on_filter: WalkerReducer<State, OnFilterParams<State>, Options> = ({$filter, $filters, state, $node, depth}) => {
	console.log(indent(depth) + `  [on_filter] "${$filter}`)
	return state
}

const on_class_before: WalkerReducer<State, OnClassParams<State>, Options> = ({$class, state, $node, depth}) => {
	console.log(indent(depth) + `  [⟩on_class_before] .${$class}`)
	return state
}
const on_class_after: WalkerReducer<State, OnClassParams<State>, Options> = ({$class, state, $node, depth}) => {
	console.log(indent(depth) + `  [⟨on_class_after] .${$class}`)
	return state
}

const on_type: WalkerReducer<State, OnTypeParams<State>, Options> = ({$type, state, $node, depth}) => {
	console.log(indent(depth) + `  [on_type] "${$type}" ${$node.$classes}`)
	return state
}

////////////////////////////////////

const callbacks: Partial<WalkerCallbacks<State, Options>> = {
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
	on_type_br: ({state, depth}: {state: any, depth: number}) => {
		console.log(indent(depth) + '  [on_type_br]')
		return state + '\\\\br\\\\'
	},
	on_type_hr: ({state, depth}: {state: any, depth: number}) => {
		console.log(indent(depth) + '  [on_type_hr]')
		return state + '--hr--'
	},
}

function to_debug($doc: Node, options: Options = DEFAULT_OPTIONS): string {
	return walk<State, Options>($doc, callbacks, options)
}

export { callbacks, to_debug }
