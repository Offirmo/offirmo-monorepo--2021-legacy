import {
	APIGatewayEvent,
	Context,
	NetlifyContext,
	Response,
	NetlifyHandler,
} from './sub/types'


const handler: NetlifyHandler = async (
	event: APIGatewayEvent,
	badly_typed_context: Context,
): Promise<Response> => {
	const msg = `Hello 20200717`
	console.log('(log)', msg)
	console.info('(info)', msg)
	console.warn('(warn)', msg)
	console.error('(error)', msg)

	return {
		statusCode: 200,
		headers: {},
		body: msg,
	}
}

export { handler }
