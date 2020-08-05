import {
	APIGatewayEvent,
	Context,
	NetlifyContext,
	Response,
	NetlifyHandler,
} from './sub/types'

import { BUILD_DATE } from './sub/build'

const handler: NetlifyHandler = async (
	event: APIGatewayEvent,
	badly_typed_context: Context,
): Promise<Response> => {
	const msg = `Hello from ${BUILD_DATE}!`
	console.log('(console.log)', msg)
	console.info('(console.info)', msg)
	console.warn('(console.warn)', msg)
	console.error('(console.error)', msg)

	return {
		statusCode: 200,
		headers: {},
		body: msg,
	}
}

export { handler }
