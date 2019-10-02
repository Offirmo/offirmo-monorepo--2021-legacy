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
		sub: netlify_id,
		app_metadata: { provider, roles },
		user_metadata: { avatar_url, full_name },
	} = identity_context.user;

	const all_the_things: any = {
		from_context: {
			netlify_id,
			email,
			provider,
			roles,
			avatar_url,
			full_name,
		},
	}

	try {
		const data = {
			called: full_name,
			avatar_url,
			email,
			roles: roles || [],
		}
		all_the_things.db_query = {
			netlify_id,
			data,
		}
		const { ensure_user_through_netlify } = require('@offirmo-private/db')
		all_the_things.db_result = await ensure_user_through_netlify(netlify_id, data)
	}
	catch (err) {
		all_the_things.db_result = `Err: ${err.message}!`
	}

	console.log(all_the_things)

	return {
		statusCode: 200,
		body: JSON.stringify(all_the_things, null, 2),
	}
}

export { handler }
