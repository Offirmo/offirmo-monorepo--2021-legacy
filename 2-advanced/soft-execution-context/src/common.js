/* global NODE_ENV process */
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'

function decorateWithDetectedEnv(SEC) {

	let ENV = (() => {
		try {
			if (typeof NODE_ENV === 'string')
				return NODE_ENV

			if (typeof process !== 'undefined' && typeof process.env.NODE_ENV === 'string')
				return process.env.NODE_ENV
		}
		catch (err) {
			/* swallow */
		}

		return 'development'
	})()

	const IS_DEV_MODE = false
	const IS_VERBOSE = false
	const CHANNEL = 'unknown'
	const SESSION_START_TIME = get_UTC_timestamp_ms()

	SEC.injectDependencies({
		ENV,
		'NODE_ENV': ENV, // yes, intentional 1) ENV = NODE_ENV 2) default value
		IS_DEV_MODE,
		IS_VERBOSE,
		CHANNEL,
		SESSION_START_TIME,
	})

	SEC.setAnalyticsAndErrorDetails({
		ENV,
		CHANNEL,
	})
}


export {
	decorateWithDetectedEnv,
}
