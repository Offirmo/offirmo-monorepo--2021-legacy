#!/bin/sh
':' //# https://sambal.org/?p=1014 ; exec `dirname $0`/../../node_modules/.bin/babel-node "$0" "$@"
'use strict'

/* eslint-disable no-unused-vars */

const { createLogger } = require('@offirmo/practical-logger-node')
const { getRootSEC } = require('@offirmo-private/soft-execution-context')

const {
	listenToUncaughtErrors,
	listenToUnhandledRejections,
	decorateWithDetectedEnv,
} = require('../..')
const good_lib  = require('./good_lib.js')

const APP = 'SEC_NODE_DEMO'

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
	logger.log('that', {err})

	// or direct to reporter
	SEC.fireAnalyticsEvent('error', {
		...err.details,
		message: err.message,
	})
})


SEC.emitter.on('analytics', function onError({SEC, eventId, details}) {
	console.groupCollapsed(`⚡  Analytics! ⚡  ${eventId}`)
	console.log('details', details)
	console.groupEnd()
})

listenToUncaughtErrors()
listenToUnhandledRejections()
decorateWithDetectedEnv()

// Top uses tryCatch
SEC.xTryCatch('starting', ({SEC, logger}) => {
	const good_lib_inst = good_lib.create({SEC})
	SEC.xTry('calling good lib', () => good_lib_inst.foo_sync({x: 1}))

	//throw new Error('Ha ha')

	SEC.xPromiseTry('crashing in a promise', () => {
		throw new Error('Ho ho')
	})
})
