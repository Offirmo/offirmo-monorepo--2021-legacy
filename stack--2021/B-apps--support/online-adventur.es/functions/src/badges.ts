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
	Response,
	NetlifyHandler,
} from './sub/types'
import { VERSION, BUILD_DATE } from './sub/build'
import { get_key_from_path } from './sub/utils'

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
		"isError": false,
		//"namedLogo": "foo",
	}


	const key = (() => {
		try {
			return get_key_from_path(event)
		}
		catch {
			return 'error'
		}
	})()

	switch(key) {
		case 'time': {
			body.label = 'build date'
			body.message = BUILD_DATE
			break
		}

		case 'version': {
			body.label = 'version'
			body.message = VERSION
			break
		}

		default: {
			body.label = String(key)
			body.message = `wrong badge key "${key}" != (time, version)`
			body.isError = true
		}
	}

	return {
		statusCode: 200,
		headers: {},
		body: JSON.stringify(body),
	}
}

export { handler }
