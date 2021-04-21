/*
process.env.UDA_OVERRIDE__LOGGER__UDA_INTERNAL_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__LOGGER_UDA_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__LOGGER_OA_DB_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__LOGGER_OA_API_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__KNEX_DEBUG = 'true'
*/
import '@offirmo/universal-debug-api-node'
import { create_server_response_body__data } from '@online-adventur.es/api-interface'

import {
	APIGatewayEvent,
	Context,
	Response,
	NetlifyHandler,
} from './sub/types'
import { on_error as report_to_sentry } from './sub/services/sentry'

////////////////////////////////////

const handler: NetlifyHandler = async (
	event: APIGatewayEvent,
	badly_typed_context: Context,
): Promise<Response> => {
	let message = event?.queryStringParameters?.message || 'Unknown error!'
	if (!message.endsWith('!'))
		message = message + '!'

	const err = new Error(message)
	await report_to_sentry(err)

	return {
		statusCode: 200,
		headers: {},
		body: JSON.stringify(create_server_response_body__data({
			result: 'Error reported✔',
			err_message: message,
		})),
	}
}

export { handler }
