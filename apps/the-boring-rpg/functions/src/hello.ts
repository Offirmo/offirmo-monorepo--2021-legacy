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
	console.log('hello')
	console.info('hello')
	console.warn('hello')
	console.error('hello')

	return {
		statusCode: 200,
		body: "Hello, TypeScript World!"
	}
}

export { handler }
