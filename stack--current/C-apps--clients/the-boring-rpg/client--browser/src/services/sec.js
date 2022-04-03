'use strict'

import { getRootSEC } from '@offirmo-private/soft-execution-context'
import {
	listenToErrorEvents,
	listenToUnhandledRejections,
	decorateWithDetectedEnv,
} from '@offirmo-private/soft-execution-context-browser'
import { decorate_SEC } from '@tbrpg/definitions'

import { LIB } from './consts'
import { VERSION } from '@tbrpg/flux'
import { CHANNEL } from './channel'
import logger from './logger'
import { get_raven_client, set_imminent_captured_error } from './raven'

//console.log(__filename)
/////////////////////////////////////////////////

export default function init() {
	const SEC = getRootSEC()
		.setLogicalStack({ module: LIB })
		.injectDependencies({ logger })

	decorate_SEC(SEC)
	decorateWithDetectedEnv(SEC)

	SEC.injectDependencies({
		CHANNEL,
		VERSION,
	})
	SEC.setAnalyticsAndErrorDetails({
		product: 'tbrpg',
		VERSION,
		CHANNEL,
	})

/////////////////////////////////////////////////

	SEC.emitter.on('final-error', function onError({SEC, err}) {
		// ignore some
		console.warn('TBRPG SEC final-error handler:', err)
		if (err.message === 'the-boring-rpg›(browser/on error event): Failed to execute \'removeChild\' on \'Node\': The node to be removed is not a child of this node.') {
			logger.info('(↑ error in the ignore list)')
			return
		}

		if (CHANNEL === 'dev') {
			logger.fatal('↑ error! (no report since dev)', {SEC, err})
			return
		}

		console.log('(this error will be reported)')
		set_imminent_captured_error(err)
		get_raven_client().captureException(err)
	})

	SEC.emitter.on('analytics', function onAnalytics({SEC, eventId, details}) {
		// TODO analytics
		console.groupCollapsed(`⚡  [TODO] Analytics! ⚡  ${eventId}`)
		console.table('details', details)
		console.groupEnd()
	})

	listenToErrorEvents()
	listenToUnhandledRejections()

	SEC.xTry('SEC/init', ({logger}) => {
		logger.trace('Root Soft Execution Context initialized.', {SEC})
	})

	const { ENV } = SEC.getInjectedDependencies()
	if (ENV !== process.env.NODE_ENV) {
		logger.error('ENV detection mismatch!', { 'SEC.ENV': ENV, 'process.env.NODE_ENV': process.env.NODE_ENV })
	}
}

/////////////////////////////////////////////////

// no, should be accessed with getRootSEC
//export default SEC
