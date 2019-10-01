import {
	APIGatewayEvent,
	Context,
	Response,
	NetlifyHandler,
} from './sub/types'

function filter_out_secrets(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
	return Object.fromEntries(
		Object.entries(env)
			.map(([k, v]) => {
				const isSecret = k.toLowerCase().includes('secret')
					|| k.toLowerCase().includes('token')
				return [ k, isSecret ? '🙈' : v ]
			})
	)
}

const handler: NetlifyHandler = async (
	event: APIGatewayEvent,
	context: Context,
): Promise<Response> => {
	const all_the_things = JSON.stringify({
		context,
		event,
		env: filter_out_secrets(process.env),
	}, null, 2)

	console.log(all_the_things)

	return {
		statusCode: 200,
		body: all_the_things,
	}
}

export { handler }
