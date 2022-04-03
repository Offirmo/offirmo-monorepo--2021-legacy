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
	NetlifyHandler, NetlifyContext,
} from './sub/types'
import { get_netlify_user_data } from './sub/services/netlify'
import * as build from './sub/build'
import { get_key_from_path, get_id_from_path } from './sub/utils'

////////////////////////////////////

export const handler: NetlifyHandler = async (
	event: APIGatewayEvent,
	badly_typed_context: Context,
): Promise<Response> => {
	const context: NetlifyContext = badly_typed_context as any

	let netlify_user_data: any
	try {
		netlify_user_data = get_netlify_user_data(context)
	}
	catch (err: any) {
		netlify_user_data = { err: { message: err?.message } }
	}


	const all_the_things = {
		badly_typed_context,
		event,
		derived: {
			get_key_from_path: (() => { try {
				return get_key_from_path(event, { expected_segment_count: null })
			} catch (err: any) { return err?.message }})(),
			get_id_from_path: (() => { try {
				return get_id_from_path(event, { expected_segment_count: null })
			} catch (err: any) { return err?.message }})(),
		},
		netlify_user_data,
		build,
		// https://devdocs.io/node/process
		process: {
			//argv: process.argv,
			//execArgv: process.execArgv,
			//execPath: process.execPath,
			arch: process.arch,
			platform: process.platform,
			//config: process.config,
			//'cwd()': process.cwd(),
			//title: process.title,
			version: process.version,
			//release: process.release,
			versions: process.versions,
			env: _filter_out_secrets(process.env),
		},
	}

	console.log('will return:', all_the_things)

	const body = create_server_response_body__data(all_the_things)

	return {
		statusCode: 200,
		headers: {},
		body: JSON.stringify(body, null, 2),
	}
}


function _filter_out_secrets(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
	return Object.entries(env)
		.map(([k, v]) => {
			const isSecret = k.toLowerCase().includes('secret')
				|| k.toLowerCase().includes('token')
				|| k.toLowerCase().includes('key')
			return [ k, isSecret ? '🙈' : v ]
		})
		.reduce((acc: any, [k, v]: any) => {
			acc[k] = v
			return acc
		}, {} as any)
}
