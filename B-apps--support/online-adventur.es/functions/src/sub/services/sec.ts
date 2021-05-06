import { Immutable } from '@offirmo-private/ts-types'
import { Logger } from '@offirmo/universal-debug-api-node'
import {
	getRootSEC,
	BaseInjections,
	OperationParams,
	Operation,
	SoftExecutionContext,
	WithSEC,
	EventDataMap,
} from '@offirmo-private/soft-execution-context'
//import { JSONRpcRequest, JSONRpcResponse } from '@offirmo-private/json-rpc-types'
import {
	listenToUncaughtErrors,
	listenToUnhandledRejections,
	decorateWithDetectedEnv,
} from '@offirmo-private/soft-execution-context-node'
import { Users } from '@offirmo-private/db'

import { APP } from '../consts'
import { CHANNEL } from './channel'
import logger from './logger'

/////////////////////////////////////////////////

export interface Injections extends BaseInjections {
	logger: Logger
	p_user?: Immutable<Users.PUser>
	user?: Users.User
	//jsonrpc_request?: JSONRpcRequest<{}>,
	//jsonrpc_response?: JSONRpcResponse<{}>,
}

export type XSoftExecutionContext = SoftExecutionContext<Injections>
export type WithXSEC = WithSEC<Injections>
export type XSECEventDataMap = EventDataMap<Injections>
export type XOperationParams = OperationParams<Injections>
export type XOperation<T> = Operation<T, Injections>

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

// remove all the listeners installed by AWS (if any)
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

export { LXXError } from '../utils'
