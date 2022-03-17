#!/bin/sh
':' //# http://sambal.org/?p=1014 ; exec /usr/bin/env node "$0" "$@"
"use strict";

const APP = 'SEC_DEMO_01'

console.log(`Hello from ${APP}...`)

const ROOT = '../../../'

const soft_execution_context = require(ROOT + 'soft-execution-context-node')
const { createLogger } = require(ROOT + 'practical-logger-node')
//const { createLogger } = require(ROOT + 'universal-logger-browser')

const logger = createLogger({
	name: APP,
	level: 'trace',
})

function onError(err) {
	logger.fatal('error!', {err})
}

const SEC = soft_execution_context.node.create({
	module: APP,
	onError,
	context: {
		logger,
	},
})

// TODO should work whether this line is on or off
//soft_execution_context.setRoot(SEC)

SEC.listenToUncaughtErrors()
SEC.listenToUnhandledRejections()

// Top uses tryCatch
SEC.xTryCatch('starting', ({SEC, logger}) => {
	logger.log('...')

	// sync, immediate
	//throw new Error('Foo')

	// sync, in libs
	/*
	const bad_lib = require('./bad_lib')
	SEC.xTry('calling bad lib', () => bad_lib.foo_sync())
	*/


	const good_lib = require('./good_lib').create({SEC})
	SEC.xTry('calling good lib', () => good_lib.foo_sync())

	/*
	const intercepting_lib = require('./intercepting_lib')
	SEC.xTry('calling intercepting lib', () => intercepting_lib.foo_sync())
	*/

	console.log('--- this should not be called !! ---')


	//const good_lib = require('./good_lib').create({SEC})

	//return SEC.xPromiseResolve('calling bad lib', bad_lib.foo_async())
	//return intercepting_lib.foo_async()
	return SEC.xPromiseTry('calling intercepting lib', () => intercepting_lib.foo_async())
	//return good_lib.foo_async().then(() => console.log('--- this should not be called !! ---'))
})
