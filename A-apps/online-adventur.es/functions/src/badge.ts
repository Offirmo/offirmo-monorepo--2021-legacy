/*
process.env.UDA_OVERRIDE__LOGGER__UDA_INTERNAL_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__LOGGER_UDA_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__LOGGER_OA_DB_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__LOGGER_OA_API_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__KNEX_DEBUG = 'true'
*/
import '@offirmo/universal-debug-api-node'

import {
	APIGatewayEvent,
	Context,
	NetlifyContext,
	Response,
	NetlifyHandler,
} from './sub/types'
import { BUILD_DATE } from './sub/build'

////////////////////////////////////

const handler: NetlifyHandler = async (
	event: APIGatewayEvent,
	badly_typed_context: Context,
): Promise<Response> => {
	// https://shields.io/endpoint
	const body = {
		"schemaVersion": 1,
		"label": "label",
		"message": "message",
		//"color": "orange",
		//"isError": false,
		//"namedLogo": "foo",
	}

	return {
		statusCode: 200,
		headers: {},
		body: JSON.stringify(body),
	}
}

export { handler }
