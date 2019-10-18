import { Logger } from '@offirmo/practical-logger-interface'
import { getRootSEC, BaseInjections, SoftExecutionContext, WithSEC, EventDataMap } from '@offirmo-private/soft-execution-context'
import {
	listenToUncaughtErrors,
	listenToUnhandledRejections,
	decorateWithDetectedEnv,
} from '@offirmo-private/soft-execution-context-node'
import { XError } from '../utils'

import { APP } from '../consts'
import { CHANNEL } from './channel'
import logger from './logger'

/////////////////////////////////////////////////

export interface Injections extends BaseInjections {
	logger: Logger
}

export type XSoftExecutionContext = SoftExecutionContext<Injections>
export type WithXSEC = WithSEC<Injections>
export type XSECEventDataMap = EventDataMap<Injections>

/////////////////////

const SEC: XSoftExecutionContext = getRootSEC<Injections>()
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

SEC.emitter.on('analytics', function onAnalytics({SEC, eventId, details}) {
	console.groupCollapsed(`⚡  [TODO] Analytics! ⚡  ${eventId}`)
	console.table('details', details)
	console.groupEnd()
})

listenToUncaughtErrors()
listenToUnhandledRejections()

SEC.xTry('SEC/init', ({logger}) => {
	logger.trace('Soft Execution Context initialized.')
})

const { ENV } = SEC.getInjectedDependencies()
if (ENV !== process.env.NODE_ENV) {
	logger.error('ENV detection mismatch!', { 'SEC.ENV': ENV, 'process.env.NODE_ENV': process.env.NODE_ENV })
}

/////////////////////////////////////////////////

export default SEC
export {
	XError,
	SEC,
}
