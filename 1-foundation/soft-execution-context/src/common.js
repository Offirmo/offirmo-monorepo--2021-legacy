import { get_UTC_timestamp_ms } from '@offirmo/timestamps'

function decorateWithDetectedEnv(SEC) {

	const ENV = typeof NODE_ENV === 'string'
		? NODE_ENV
		: 'development'

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


module.exports = {
	decorateWithDetectedEnv,
}
