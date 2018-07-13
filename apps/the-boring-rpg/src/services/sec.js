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
	// TODO sentry instead
	logger.fatal('error!', {err})
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
