import { WalkerCallbacks, WalkerReducer, AnyParams } from './walk'

const on_concatenate_sub_node: WalkerReducer<string, AnyParams<string>> = ({state, sub_state, $id, $parent_node}) => {
	if ($parent_node.$type === 'ul')
		return state + '\n - ' + sub_state

	if ($parent_node.$type === 'ol')
		return state + `\n ${(' ' + $id).slice(-2)}. ` + sub_state

	return state + sub_state
}

const callbacks: Partial<WalkerCallbacks<string>> = {
	on_node_enter: () => '',
	on_concatenate_str: ({state, str}) => state + str,
	on_concatenate_sub_node,
	on_type_br: ({state}: {state: string}) => state + '\n',
	on_type_hr: ({state}: {state: string}) => state + '\n------------------------------------------------------------\n',
}

export { callbacks }
