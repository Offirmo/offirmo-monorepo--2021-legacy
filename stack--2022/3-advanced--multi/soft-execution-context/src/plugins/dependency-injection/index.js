import { INTERNAL_PROP } from '../../consts'
import * as TopState from '../../state'
import * as State from './state'
import { flattenToOwn } from '../../utils'

const PLUGIN_ID = 'dependency_injection'

const PLUGIN = {
	id: PLUGIN_ID,
	state: State,
	augment: prototype => {

		prototype.injectDependencies = function injectDependencies(deps) {
			let root_state = this[INTERNAL_PROP]

			root_state = TopState.reduce_plugin(root_state, PLUGIN_ID, state => {
				Object.entries(deps).forEach(([key, value]) => {
					state = State.injectDependencies(state, key, value)
				})
				return state
			})

			this[INTERNAL_PROP] = root_state

			return this // for chaining
		}

		prototype.getInjectedDependencies = function getInjectedDependencies() {
			const plugin_state = this[INTERNAL_PROP].plugins[PLUGIN_ID]

			return flattenToOwn(plugin_state.context)
		}

	},
}

export {
	PLUGIN_ID,
	PLUGIN,
}
