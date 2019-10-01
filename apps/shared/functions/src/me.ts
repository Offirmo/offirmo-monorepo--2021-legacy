import {
	APIGatewayEvent,
	Context,
	Response,
	NetlifyHandler,
	NetlifyIdentityContext,
} from './sub/types'


const handler: NetlifyHandler = async (
	event: APIGatewayEvent,
	context: Context,
): Promise<Response> => {

	if (!context.clientContext)
		throw new Error('No/bad/outdated token!')

	const identity_context: NetlifyIdentityContext = context.clientContext as any
	if (!identity_context.user)
		throw new Error('No/bad/outdated token!')

	const {
		email,
		sub,
		app_metadata: { provider, roles },
		user_metadata: { avatar_url, full_name },
	} = identity_context.user;

	const all_the_things = JSON.stringify({
		uuid: sub,
		email,
		provider,
		roles,
		avatar_url,
		full_name,
	}, null, 2)

	console.log(all_the_things)

	return {
		statusCode: 200,
		body: all_the_things,
	}
}

export { handler }
