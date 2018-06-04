import 'babel-polyfill'
import { createLogger } from '@offirmo/practical-logger-browser'
import { getRootSEC } from '@offirmo/soft-execution-context'

import {
	listenToErrorEvents,
	listenToUnhandledRejections,
	decorateWithDetectedEnv,
} from '../src/index.js'
import * as good_lib from './good_lib.js'

const APP = 'SEC_BROWSER_DEMO'

const logger = createLogger({
	name: APP,
	level: 'silly',
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
		error: "color: red; font-weight: bold",
	};

	console.groupCollapsed(`%c💣💣💣 Crashed! 💣💣💣 ${err.message}`, styles.error)
	console.log(`%c${err.message}`, styles.error)
	console.log('details', err.details)
	console.log(err)
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

	SEC.xPromiseTry('crashing in a promise', () => {
		throw new Error('Ho ho')
	})
})
