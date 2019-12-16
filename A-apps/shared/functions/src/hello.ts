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
	const msg = `Hello 20191202`
	console.log(msg)
	console.info(msg)
	console.warn(msg)
	console.error(msg)

	return {
		statusCode: 200,
		headers: {},
		body: msg,
	}
}

export { handler }
