
import {INTERNAL_PROP} from '../../constants.js'
import * as TopState from '../../state.js'
import {
	SUB_LIB,
	LOGICAL_STACK_BEGIN_MARKER,
	LOGICAL_STACK_END_MARKER,
	LOGICAL_STACK_MODULE_MARKER,
	LOGICAL_STACK_SEPARATOR,
	LOGICAL_STACK_OPERATION_MARKER,
	LOGICAL_STACK_SEPARATOR_NON_ADJACENT,
} from './constants.js'
import * as State from './state.js'

const ID = 'logical_stack'

const PLUGIN = {
	id: ID,
	state: State,
	augment: prototype => {

		prototype.set_logical_stack = function set_logical_stack({module, operation}) {
			let root_state = this[INTERNAL_PROP]

			root_state = TopState.reduce_plugin(root_state, ID, state => {
				if (module)
					state = State.set_module(state, module)
				if (operation)
					state = State.set_operation(state, operation)

				return state
			})

			this[INTERNAL_PROP] = root_state

			return this
		}

		prototype.get_logical_stack = function get_logical_stack() {
			return 'TODO'
		}

		prototype.get_stack_end = function get_stack_end() {
			const state = this[INTERNAL_PROP].plugins[ID]
			return LOGICAL_STACK_BEGIN_MARKER
				+ LOGICAL_STACK_MODULE_MARKER
				+ state.stack.module
				+ LOGICAL_STACK_SEPARATOR
				+ state.stack.operation
				+ LOGICAL_STACK_OPERATION_MARKER
		}

	}
}

export {
	PLUGIN,
}
