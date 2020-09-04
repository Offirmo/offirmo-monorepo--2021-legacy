import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'

import { INTERNAL_PROP } from '../../consts'
import * as TopState from '../../state'
import { flattenToOwn } from '../../utils'
import * as State from './state'
import {PLUGIN_ID as ID_DI} from '../dependency-injection'

const PLUGIN_ID = 'analytics'

const PLUGIN = {
	id: PLUGIN_ID,
	state: State,
	augment: prototype => {

		prototype.setAnalyticsDetails = function setAnalyticsDetails(details) {
			const SEC = this
			let root_state = SEC[INTERNAL_PROP]

			root_state = TopState.reduce_plugin(root_state, PLUGIN_ID, plugin_state => {
				Object.entries(details).forEach(([key, value]) => {
					plugin_state = State.addDetail(plugin_state, key, value)
				})
				return plugin_state
			})

			this[INTERNAL_PROP] = root_state

			return SEC // for chaining
		}

		prototype.fireAnalyticsEvent = function fireAnalyticsEvent(eventId, details = {}) {
			const SEC = this
			const now = get_UTC_timestamp_ms()
			const root_state = SEC[INTERNAL_PROP]

			if (!eventId)
				throw new Error('Incorrect eventId!')

			const { ENV } = SEC.getInjectedDependencies()

			const autoDetails = {
				ENV,
				TIME: now,
				SESSION_DURATION_MS: now - root_state.plugins[ID_DI].context.SESSION_START_TIME_MS,
			}
			const userDetails = SEC.getAnalyticsDetails()
			details = {
				...autoDetails,
				...userDetails,
				...details,
			}

			SEC.emitter.emit('analytics', { SEC, eventId, details })

			return SEC // for chaining
		}

		prototype.getAnalyticsDetails = function getAnalyticsDetails() {
			const SEC = this
			const plugin_state = SEC[INTERNAL_PROP].plugins[PLUGIN_ID]

			return flattenToOwn(plugin_state.details)
		}

	},
}

export {
	PLUGIN_ID,
	PLUGIN,
}
