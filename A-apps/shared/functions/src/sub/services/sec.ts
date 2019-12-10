import { Logger } from '@offirmo/universal-debug-api-node'
import { getRootSEC, BaseInjections, SoftExecutionContext, WithSEC, EventDataMap } from '@offirmo-private/soft-execution-context'
import { JSONRpcRequest, JSONRpcResponse } from '@offirmo-private/json-rpc-types'
import {
	listenToUncaughtErrors,
	listenToUnhandledRejections,
	decorateWithDetectedEnv,
} from '@offirmo-private/soft-execution-context-node'
import { Users } from '@offirmo-private/db'

import { XError } from '../utils'
import { APP } from '../consts'
import { CHANNEL } from './channel'
import logger from './logger'

/////////////////////////////////////////////////

export interface Injections extends BaseInjections {
	logger: Logger
	user_p?: Users.PUser
	user?: Users.User
	jsonrpc_request?: JSONRpcRequest<{}>,
	jsonrpc_response?: JSONRpcResponse<{}>,
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

// TODO externalize in SEC-node
//console.log('uncaughtException Listeners:', process.listenerCount('uncaughtException'))
//console.log('unhandledRejection Listeners:', process.listenerCount('unhandledRejection'))
process.listeners('uncaughtException').forEach(l => process.off('uncaughtException', l))
process.listeners('unhandledRejection').forEach(l => process.off('unhandledRejection', l))
listenToUncaughtErrors()
listenToUnhandledRejections()

SEC.xTry('SEC/init', ({logger}) => {
	logger.trace('Root Soft Execution Context initialized ✔')
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
