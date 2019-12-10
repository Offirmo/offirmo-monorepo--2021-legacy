/* eslint-disable no-unused-vars */
import { createLogger } from '@offirmo/practical-logger-browser'
import { getRootSEC } from '@offirmo-private/soft-execution-context'

import {
	listenToErrorEvents,
	listenToUnhandledRejections,
	decorateWithDetectedEnv,
} from '../src/index.js'
import * as good_lib from './good_lib.js'

const APP = 'SEC_BROWSER_DEMO'

const logger = createLogger({
	name: APP,
	suggestedLevel: 'silly',
})

logger.notice(`Hello from ${APP}...`)


const SEC = getRootSEC()
	.setLogicalStack({
		module: APP,
	})
	.injectDependencies({
		logger,
	})

SEC.emitter.on('final-error', function onError({SEC, err}) {
	const styles = {
		error: 'color: red; font-weight: bold',
	}

	console.groupCollapsed(`%c💣💣💣 Crashed! 💣💣💣 "${err.message}"`, styles.error)
	console.log(`%c${err.message}`, styles.error)
	console.log('details', err.details)
	console.log(err)
	console.groupEnd()

	SEC.fireAnalyticsEvent('error', {
		...err.details,
		message: err.message,
	})
})


SEC.emitter.on('analytics', function onError({SEC, eventId, details}) {
	console.groupCollapsed(`⚡ Analytics! ⚡ "${eventId}"`)
	console.log(`eventId: "${eventId}"`)
	console.log('details', details)
	console.groupEnd()
})

listenToErrorEvents()
listenToUnhandledRejections()
decorateWithDetectedEnv()

// Top uses tryCatch
SEC.xTry('starting', ({SEC, logger}) => {
	const good_lib_inst = good_lib.create({SEC})
	SEC.xTry('calling good lib', () => good_lib_inst.foo_sync({x: 1}))

	throw new Error('Ha ha')
/*
	SEC.xPromiseTry('crashing in a promise', () => {
		throw new Error('Ho ho')
	})*/
})
