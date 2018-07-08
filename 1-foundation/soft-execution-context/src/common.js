
function decorateWithDetectedEnv(SEC) {
	const ENV = typeof NODE_ENV === 'string'
		? NODE_ENV
		: 'development'

	const DEBUG = false // TODO or verbose?

	SEC.injectDependencies({
		ENV,
		DEBUG: false, // verbose? TODO
	})

	SEC.setAnalyticsAndErrorDetails({
		env: ENV,
	})
}


module.exports = {
	decorateWithDetectedEnv,
}
