import {
	APIGatewayEvent,
	Context,
	Response,
	NetlifyHandler,
} from './sub/types'

const handler: NetlifyHandler = async (
	event: APIGatewayEvent,
	context: Context,
): Promise<Response> => {
	const msg = `Hello 20191001`
	console.log(msg)
	console.info(msg)
	console.warn(msg)
	console.error(msg)

	return {
		statusCode: 200,
		body: msg,
	}
}

export { handler }
