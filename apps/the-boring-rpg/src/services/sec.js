"use strict";

import {CHANNEL} from './channel'

const { getRootSEC } = require('@offirmo/soft-execution-context')
const {
	listenToErrorEvents,
	listenToUnhandledRejections,
	decorateWithDetectedEnv,
} = require('@offirmo/soft-execution-context-browser')
const { decorate_SEC } = require('@oh-my-rpg/definitions')

import { LIB } from './consts'
import logger from './logger'
import raven_client, { set_imminent_captured_error } from './raven'

/////////////////////////////////////////////////

const SEC = getRootSEC()
	.setLogicalStack({ module: LIB })
	.injectDependencies({ logger })

decorate_SEC(SEC)
decorateWithDetectedEnv(SEC)

SEC.setAnalyticsAndErrorDetails({
	product: 'tbrpg',
	v: WI_VERSION,
	channel: CHANNEL,
})

/////////////////////////////////////////////////

SEC.emitter.on('final-error', function onError({SEC, err}) {
	if (CHANNEL === 'dev') {
		logger.fatal('↑ error!', {SEC, err})
	}
	else {
		set_imminent_captured_error(err)
		raven_client.captureException(err)
		console.log('(the error above↑ was reported)')
	}
})

SEC.emitter.on('analytics', function onAnalytics({SEC, eventId, details}) {
	// TODO google!
	console.groupCollapsed(`⚡  Analytics! ⚡  ${eventId}`)
	console.log('details', details)
	console.groupEnd()
})

listenToErrorEvents()
listenToUnhandledRejections()

logger.trace('Soft Execution Context initialized.', {SEC})


const { ENV } = SEC.getInjectedDependencies()
if (ENV !== WI_ENV) {
	logger.error('ENV detection mismatch!', {'SEC.ENV': ENV, 'WI_ENV': WI_ENV})
}

/////////////////////////////////////////////////

export default SEC
