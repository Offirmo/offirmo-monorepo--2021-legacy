const os = require('os')

const { getRootSEC } = require('@offirmo-private/soft-execution-context')

// TODO protect from double install


function listenToUncaughtErrors() {
	const SEC = getRootSEC()
		.createChild()
		.setLogicalStack({operation: '(node/uncaught)'})

	process.on('uncaughtException', err => {
		SEC._handleError({
			SEC,
			debugId: 'node/uncaught',
			shouldRethrow: false,
		}, err)
	})
}


function listenToUnhandledRejections() {
	const SEC = getRootSEC()
		.createChild()
		.setLogicalStack({operation: '(node/unhandled rejection)'})

	process.on('unhandledRejection', err => {
		SEC._handleError({
			SEC,
			debugId: 'node/unhandled rejection',
			shouldRethrow: false,
		}, err)
	})
}


function decorateWithDetectedEnv() {
	const SEC = getRootSEC()

	// TODO normalize browser/os detection
	const details = {
		node_version: process.versions.node,
		os_platform: os.platform(),
		os_release: os.release(),
		os_type: os.type(),
	}

	SEC.setAnalyticsAndErrorDetails(details)
}

// for unit tests only, for convenience
function _force_uda_logger_with_level(suggestedLevel) {
	try {
		try {
			getRootSEC().getInjectedDependencies().logger.setLevel(suggestedLevel)
		}
		catch {
			const { getLogger } = require('@offirmo/universal-debug-api-node')
			const logger = getLogger({ suggestedLevel })
			getRootSEC().injectDependencies({ logger })
		}
	}
	catch (err) {
		getRootSEC().getInjectedDependencies().logger.warn('Couldn’t force an UDA logger with given level!')
	}
}

module.exports = {
	...require('@offirmo-private/soft-execution-context'),
	listenToUncaughtErrors,
	listenToUnhandledRejections,
	decorateWithDetectedEnv,
	_force_uda_logger_with_level,
}
