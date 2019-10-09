import {
	APIGatewayEvent,
	Context,
	NetlifyContext,
	Response,
	NetlifyHandler,
	NetlifyClientContext,
} from './sub/types'
import {
	ensure_netlify_logged_in,
	get_netlify_user_data,
} from './sub/netlify'


const handler: NetlifyHandler = async (
	event: APIGatewayEvent,
	badly_typed_context: Context,
): Promise<Response> => {
	const who_am_i: any = {
	}

	try {
		const context: NetlifyContext = badly_typed_context as any

		who_am_i['1-netlify_client_context'] = context.clientContext

		const netlify_user_data = get_netlify_user_data(context)

		who_am_i['2-extracted_from_context'] = netlify_user_data

		const {
			netlify_id,
			email,
			roles,
			avatar_url,
			full_name,
		} = netlify_user_data

		const data = {
			called: full_name,
			avatar_url,
			email,
			roles: roles || [],
		}
		who_am_i.db_query = {
			netlify_id,
			data,
		}
		const { ensure_user_through_netlify } = require('@offirmo-private/db')
		who_am_i['3-DB_result'] = await ensure_user_through_netlify(netlify_id, data)
	}
	catch (err) {
		who_am_i.err = `Err: ${err.message}!`
	}

	console.log(who_am_i)

	return {
		statusCode: 200,
		body: JSON.stringify(who_am_i, null, 2),
	}
}

export { handler }
