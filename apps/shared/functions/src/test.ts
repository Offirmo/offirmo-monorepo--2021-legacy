import {
	APIGatewayEvent,
	Context,
	NetlifyContext,
	Response,
	NetlifyHandler,
	NetlifyClientContext,
} from './sub/types'

import { XError, SECContext, SEC } from './sub/services/sec'
import { create_error } from './sub/utils'

import {
	ensure_netlify_logged_in,
	get_netlify_user_data,
} from './sub/netlify'
import {get_default_JsonRpc_error} from "./sub/consts";


const handler: NetlifyHandler = async (
	event: APIGatewayEvent,
	badly_typed_context: Context,
): Promise<Response> => {
	return new Promise((resolve, reject) => {
		SEC.emitter.on('final-error', ({SEC, err}: {SEC: any, err: XError}) => {
			// TODO raven
			if (!err.statusCode && !err.res)
				reject(err)

			const statusCode = err.statusCode || 500
			const res = err.res || `[Error] ${err.message}`

			resolve({
				statusCode,
				body: JSON.stringify(res),
			})
		})

		return SEC.xPromiseTryCatch('/test', ({SEC, logger}: SECContext) => {
			//throw new Error('Test sync!')
			//throw create_error('Test sync!', { statusCode: 555 })
			/*new Promise(() => {
				throw create_error('In uncaught promise!', { statusCode: 555 })
			})*/
			setTimeout(() => {
				throw create_error('In uncaught async!', { statusCode: 555 })
			}, 100)
		})
	})
}

export { handler }
