import { Logger } from '@offirmo/practical-logger-interface'
import { XError } from "@offirmo-private/common-error-fields"
import { getRootSEC } from '@offirmo-private/soft-execution-context'
import {
	listenToUncaughtErrors,
	listenToUnhandledRejections,
	decorateWithDetectedEnv,
} from '@offirmo-private/soft-execution-context-node'

import { APP } from '../consts'
//import { CHANNEL } from './channel'
import logger from './logger'

/////////////////////////////////////////////////


// TODO move to SEC lib when turned to TS
type SoftExecutionContext = any

interface BaseContext {
	SEC: SoftExecutionContext
	ENV: string
	logger: Logger
}

/////////////////////

const SEC = getRootSEC()
	.setLogicalStack({ module: APP })
	.injectDependencies({ logger })

decorateWithDetectedEnv(SEC)

SEC.injectDependencies({
//	CHANNEL,
//	VERSION,
})
SEC.setAnalyticsAndErrorDetails({
	product: APP,
//	VERSION,
//	CHANNEL,
})

/////////////////////////////////////////////////

SEC.emitter.on('final-error', function onError({SEC, err}: BaseContext & { err: XError }) {
	// ignore some
	console.log({err})
	if (err.message === `the-boring-rpg›(browser/on error event): Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.`) {
		logger.info('(↑ error in the ignore list)')
		return
	}
/*
	if (CHANNEL === 'dev') {
		logger.fatal('↑ error! (no report since dev)', {SEC, err})
		return
	}
*/

	console.log('(this error will be reported)')

})

SEC.emitter.on('analytics', function onAnalytics({SEC, eventId, details}: BaseContext & { eventId: string, details: any }) {
	// TODO analytics
	console.groupCollapsed(`⚡  [TODO] Analytics! ⚡  ${eventId}`)
	console.table('details', details)
	console.groupEnd()
})

listenToUncaughtErrors()
listenToUnhandledRejections()

SEC.xTry('SEC/init', ({logger}: BaseContext) => {
	logger.trace('Soft Execution Context initialized.', {SEC})
})

const { ENV } = SEC.getInjectedDependencies()
if (ENV !== process.env.NODE_ENV) {
	logger.error('ENV detection mismatch!', { 'SEC.ENV': ENV, 'process.env.NODE_ENV': process.env.NODE_ENV })
}

/////////////////////////////////////////////////

export default SEC
