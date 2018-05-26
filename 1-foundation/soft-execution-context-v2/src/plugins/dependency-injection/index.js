import { INTERNAL_PROP } from '../../constants.js'
import * as TopState from '../../state.js'
import * as State from './state.js'

const ID = 'dependency_injection'

const PLUGIN = {
	id: ID,
	state: State,
	augment: prototype => {

		prototype.inject_dependency = function inject_dependencies(deps) {
			let root_state = this[INTERNAL_PROP]

			root_state = TopState.reduce_plugin(root_state, ID, state => {
				Object.entries(deps).forEach(([key, value]) => {
					state = State.inject_dependency(state, key, value)
				})
				return state
			})

			this[INTERNAL_PROP] = root_state

			return this
		}

	}
}

export {
	PLUGIN,
}
