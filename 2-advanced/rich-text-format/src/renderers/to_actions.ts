import {
	OnConcatenateStringParams,
	OnConcatenateSubNodeParams,
	OnNodeEnterParams,
	OnTypeParams,
	walk,
	WalkerCallbacks,
	WalkerReducer
} from '../walk'
import { Node, CheckedNode } from '../types'

export interface Action {
	$node: CheckedNode
	type: 'link' | undefined
	data: any
	// priority ?
	// TODO more
}

export type State = {
	actions: Action[],
}

const on_type: WalkerReducer<State, OnTypeParams<State>> = ({$type, state, $node, depth}) => {
	//console.log('[on_type]', { $type, state })


	if ($node.$hints.href) {
		state.actions.push({
			$node,
			type: 'link',
			data: $node.$hints.href, // TODO escaping for security? (This is debug, see React renderer which will do)
		})
	}

	return state
}

const on_concatenate_sub_node: WalkerReducer<State, OnConcatenateSubNodeParams<State>> = ({state, sub_state, $node, $id, $parent_node}) => {
	state.actions = state.actions.concat(...sub_state.actions)

	return state
}

const callbacks: Partial<WalkerCallbacks<State>> = {
	on_node_enter: ({$node}: OnNodeEnterParams<State>) => ({
		actions: [],
	}),
	on_concatenate_str: ({state, str}: OnConcatenateStringParams<State>) => {
		// nothing
		return state
	},
	on_concatenate_sub_node,
	on_type,
}


function to_actions($doc: Node): Action[] {
	return walk<State>($doc, callbacks).actions
}

export {
	callbacks,
	to_actions,
}
