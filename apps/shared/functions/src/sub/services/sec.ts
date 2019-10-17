import { Logger } from '@offirmo/practical-logger-interface'
import { getRootSEC } from '@offirmo-private/soft-execution-context'
import {
	listenToUncaughtErrors,
	listenToUnhandledRejections,
	decorateWithDetectedEnv,
} from '@offirmo-private/soft-execution-context-node'
import { XError } from '../utils'

import { APP } from '../consts'
import { CHANNEL } from './channel'
import logger from './logger'
import { on_error } from './sentry'

/////////////////////////////////////////////////


// TODO move to SEC lib when turned to TS
type SoftExecutionContext = any

interface BaseContext {
	SEC: SoftExecutionContext
	ENV: string
	logger: Logger
}

interface SECContext extends BaseContext {
	// TODO
}

/////////////////////

const SEC = getRootSEC()
	.setLogicalStack({ module: APP })
	.injectDependencies({ logger })

decorateWithDetectedEnv(SEC)

SEC.injectDependencies({
	CHANNEL,
//	VERSION,
})
SEC.setAnalyticsAndErrorDetails({
	product: APP,
//	VERSION,
	CHANNEL,
})

/////////////////////////////////////////////////

SEC.emitter.on('final-error', function onError({SEC, err}: BaseContext & { err: XError }) {
	on_error(err)
	//console.log({err})

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
export {
	XError,
	SECContext,
	SEC,
}
