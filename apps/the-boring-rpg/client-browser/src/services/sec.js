'use strict'

import { getRootSEC } from '@offirmo/soft-execution-context'
import {
	listenToErrorEvents,
	listenToUnhandledRejections,
	decorateWithDetectedEnv,
} from '@offirmo/soft-execution-context-browser'
import { decorate_SEC } from '@oh-my-rpg/definitions'

import { LIB } from './consts'
import { VERSION } from './build.json'
import { CHANNEL } from './channel'
import logger from './logger'
import raven_client, { set_imminent_captured_error } from './raven'

/////////////////////////////////////////////////

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
	console.log({err})
	if (err.message === `the-boring-rpg›(browser/on error event): Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.`) {
		logger.info('(↑ error in the ignore list)')
		return
	}

	if (CHANNEL === 'dev') {
		logger.fatal('↑ error! (no report since dev)', {SEC, err})
		return
	}

	set_imminent_captured_error(err)
	raven_client.captureException(err)
	console.log('(this error will be reported)')
})

SEC.emitter.on('analytics', function onAnalytics({SEC, eventId, details}) {
	// TODO
	console.groupCollapsed(`⚡  Analytics! ⚡  ${eventId}`)
	console.log('details', details)
	console.groupEnd()
})

listenToErrorEvents()
listenToUnhandledRejections()

SEC.xTry('SEC/browser/listenToUnhandledRejections', ({logger}) => {
	logger.trace('Soft Execution Context initialized.', {SEC})
})

const { ENV } = SEC.getInjectedDependencies()
if (ENV !== process.env.NODE_ENV) {
	logger.error('ENV detection mismatch!', { 'SEC.ENV': ENV, 'process.env.NODE_ENV': process.env.NODE_ENV })
}

/////////////////////////////////////////////////

export default SEC
