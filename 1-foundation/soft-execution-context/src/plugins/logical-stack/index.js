
import {INTERNAL_PROP} from '../../constants'
import * as TopState from '../../state'
import {
	SUB_LIB,
	LOGICAL_STACK_BEGIN_MARKER,
	LOGICAL_STACK_END_MARKER,
	LOGICAL_STACK_MODULE_MARKER,
	LOGICAL_STACK_SEPARATOR,
	LOGICAL_STACK_OPERATION_MARKER,
	LOGICAL_STACK_SEPARATOR_NON_ADJACENT,
} from './constants'
import * as State from './state'
import { _getSECStatePath } from '../../utils'

const PLUGIN_ID = 'logical_stack'

const branchJumpPseudoState = {
	sid: -1,
	plugins: {
		[PLUGIN_ID]: {
			stack: {
				operation: LOGICAL_STACK_SEPARATOR_NON_ADJACENT,
			}
		}
	}
}

function _reduceStatePathToLogicalStack(statePath) {
	let current_module = null
	return statePath.reduce((res, state) => {
		const {module, operation} = state.plugins[PLUGIN_ID].stack

		if (module // check existence of module due to special case "branchJumpPseudoState" above
			&& module !== current_module
		) {
			res = res
				+ (res.length ? LOGICAL_STACK_SEPARATOR : '')
				+ module
			current_module = module
		}

		if (operation)
			res = res
				+ LOGICAL_STACK_SEPARATOR
				+ operation
				+ LOGICAL_STACK_OPERATION_MARKER

		return res
	}, '') + LOGICAL_STACK_END_MARKER
}

/*
function _reduceStacktrace(stacktrace) {
	let current_module = null
	return stacktrace.reduce((res, {module, operation}) => {
		if (module !== current_module) {
			res = res
				+ (res.length ? LOGICAL_STACK_SEPARATOR : '')
				+ module
			current_module = module
		}

		if (operation)
			res = res
				+ LOGICAL_STACK_SEPARATOR
				+ operation
				+ LOGICAL_STACK_OPERATION_MARKER

		return res
	}, '') + LOGICAL_STACK_END_MARKER
}
*/

const PLUGIN = {
	id: PLUGIN_ID,
	state: State,
	augment: prototype => {

		prototype.setLogicalStack = function setLogicalStack({module, operation}) {
			let root_state = this[INTERNAL_PROP]

			root_state = TopState.reduce_plugin(root_state, PLUGIN_ID, state => {
				if (module)
					state = State.set_module(state, module)
				if (operation)
					state = State.set_operation(state, operation)

				return state
			})

			this[INTERNAL_PROP] = root_state

			return this
		}

		prototype.getLogicalStack = function getLogicalStack() {
			const SEC = this

			return _reduceStatePathToLogicalStack(
				_getSECStatePath(SEC)
			)
			/*
			let { stack } = this[INTERNAL_PROP].plugins[PLUGIN_ID]

			const stacktrace = []
			while (stack) {
				stacktrace.unshift({
					module: stack.module,
					operation: stack.operation,
				})
				stack = Object.getPrototypeOf(stack)
			}

			return _reduceStacktrace(stacktrace)*/
		}

		prototype.getShortLogicalStack = function get_stack_end() {
			const { stack } = this[INTERNAL_PROP].plugins[PLUGIN_ID]
			return LOGICAL_STACK_BEGIN_MARKER
				+ stack.module
				+ LOGICAL_STACK_SEPARATOR
				+ stack.operation
				+ LOGICAL_STACK_OPERATION_MARKER
				+ LOGICAL_STACK_END_MARKER
		}

		prototype._decorateErrorWithLogicalStack = function _decorateErrorWithLogicalStack(err) {
			const SEC = this

			err._temp = err._temp || {}

			const logicalStack = {
				full: SEC.getLogicalStack(),
			}

			const details = {}

			if (err._temp.SEC) {
				// OK this error is already decorated.
				// Thus the message is also already decorated, don't touch it.

				// BUT we may be able to add more info, can we?
				if (err.details.logicalStack.includes(logicalStack.full)) {
					// ok, logical stack already chained, nothing to add
				}
				else {
					// SEC chain has branched, reconcile paths
					// OK maybe overkill...
					const other_path = err._temp.statePath
					const current_path = _getSECStatePath(SEC)

					// find common path
					let last_common_index = 0
					for (let i = 1; i < current_path.length; ++i) {
						if (other_path[i] !== current_path[i])
							break
						last_common_index = i
					}

					// reconcile the 2 stack traces
					let improvedStatePath = [].concat(current_path)
					improvedStatePath.push(branchJumpPseudoState)
					improvedStatePath = improvedStatePath.concat(
						other_path.slice(last_common_index + 1)
					)

					err._temp.statePath = improvedStatePath
					details.logicalStack = _reduceStatePathToLogicalStack(improvedStatePath)
				}
			}
			else {
				err._temp.SEC = SEC
				err._temp.statePath = _getSECStatePath(SEC)

				logicalStack.short = SEC.getShortLogicalStack()
				if (err.message.startsWith(logicalStack.short)) {
					// can that happen??? It's a bug!
					console.warn('SEC non-decorated error already prefixed??')
				}
				else {
					err.message = logicalStack.short + ': ' + err.message
				}

				details.logicalStack = logicalStack.full
			}

			err.details = {
				...(err.details || {}),
				...details,
			}
			//err._temp.logicalStack = logicalStack.full

			return err
		}
	}
}

export {
	PLUGIN,
}
