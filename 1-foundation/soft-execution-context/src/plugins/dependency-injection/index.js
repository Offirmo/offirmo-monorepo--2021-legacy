import { INTERNAL_PROP } from '../../constants'
import * as TopState from '../../state'
import * as State from './state'
import { flattenToOwn } from '../../utils'

const ID = 'dependency_injection'

const PLUGIN = {
	id: ID,
	state: State,
	augment: prototype => {

		prototype.injectDependencies = function injectDependencies(deps) {
			let root_state = this[INTERNAL_PROP]

			root_state = TopState.reduce_plugin(root_state, ID, state => {
				Object.entries(deps).forEach(([key, value]) => {
					state = State.injectDependencies(state, key, value)
				})
				return state
			})

			this[INTERNAL_PROP] = root_state

			return this // for chaining
		}

		prototype.getInjectedDependencies = function getInjectedDependencies() {
			const state = this[INTERNAL_PROP].plugins[ID]

			return flattenToOwn(state.context)
		}

	}
}

export {
	ID,
	PLUGIN,
}
