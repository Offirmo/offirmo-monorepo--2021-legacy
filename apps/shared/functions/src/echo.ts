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
	const all_the_things = JSON.stringify({
		context,
		event,
		env: Object.fromEntries(Object.entries(process.env).map(([k, v]) => {
			const isSecret = k.toLowerCase().includes('secret')
				|| k.toLowerCase().includes('token')
			return [ k, isSecret ? '🙈' : v ]
		})),
	}, null, 2)

	console.log(all_the_things)

	return {
		statusCode: 200,
		body: all_the_things,
	}
}

export { handler }
