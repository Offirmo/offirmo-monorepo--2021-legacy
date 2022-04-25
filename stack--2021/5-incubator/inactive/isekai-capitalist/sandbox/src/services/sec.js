'use strict'

import { getRootSEC } from '@offirmo-private/soft-execution-context'
import {
	listenToErrorEvents,
	listenToUnhandledRejections,
	decorateWithDetectedEnv,
} from '@offirmo-private/soft-execution-context-browser'

import { LIB } from '../consts'
import logger from './logger'

/////////////////////////////////////////////////

export default function init() {
	const SEC = getRootSEC()
		.setLogicalStack({ module: LIB })
		.injectDependencies({ logger })

	decorateWithDetectedEnv(SEC)

	/*
	SEC.injectDependencies({
		CHANNEL,
		VERSION,
	})
	SEC.setAnalyticsAndErrorDetails({
		product: 'tbrpg',
		VERSION,
		CHANNEL,
	})*/

/////////////////////////////////////////////////

	/*SEC.emitter.on('final-error', function onError({SEC, err}) {

	})*/

	SEC.emitter.on('analytics', function onAnalytics({SEC, eventId, details}) {
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
