/* eslint-disable no-unused-vars */
import { createLogger } from '@offirmo/practical-logger-browser'

import {getRootSEC} from '../../src/index.js'
import * as good_lib from './good_lib.js'

const APP = 'SEC_DEMO_01'

const logger = createLogger({
	name: APP,
	suggestedLevel: 'silly',
})

logger.log(`Hello from ${APP}...`)


const SEC = getRootSEC()
SEC.setLogicalStack({
	module: APP,
})
SEC.injectDependencies({
	logger,
})
SEC.emitter.on('final-error', function onError({SEC, err}) {
	logger.fatal('Crashed!', {err})
})

/* TODOOO
SEC.listenToUncaughtErrors()
SEC.listenToUnhandledRejections()
*/

// Top uses tryCatch
SEC.xTryCatch('starting', ({SEC, logger}) => {
	logger.log(SEC.getLogicalStack())

	// sync, immediate
	//throw new Error('Foo')

	// sync, in libs
	/*
	const bad_lib = require('./bad_lib')
	SEC.xTry('calling bad lib', () => bad_lib.foo_sync())
	*/

	const good_lib_inst = good_lib.create({SEC})
	SEC.xTry('calling good lib', () => good_lib_inst.foo_sync())

	/*
	const intercepting_lib = require('./intercepting_lib')
	SEC.xTry('calling intercepting lib', () => intercepting_lib.foo_sync())
	*/

	logger.log('--- this should not be called !! ---')

	//const good_lib_inst = require('./good_lib_inst').create({SEC})

	//return SEC.xPromiseResolve('calling bad lib', bad_lib.foo_async())
	//return intercepting_lib.foo_async()
	//return SEC.xPromiseTry('calling intercepting lib', () => intercepting_lib.foo_async())
	//return good_lib_inst.foo_async().then(() => logger.log('--- this should not be called !! ---'))
})
