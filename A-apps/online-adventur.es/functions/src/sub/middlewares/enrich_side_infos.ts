import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import {
	OAServerResponseBody,
	create_server_response_body__data,
	create_server_response_body__error,
} from '@online-adventur.es/functions-interface'

import {
	APIGatewayEvent,
	NetlifyContext,
	Response,
} from '../types'
import { create_error } from '../utils'
import { XSoftExecutionContext } from './types'

////////////////////////////////////

export default async function enrich_side_infos(
	SEC: XSoftExecutionContext,
	event: Readonly<APIGatewayEvent>,
	context: Readonly<NetlifyContext>,
	response: Response,
	next: Function
): Promise<void> {

	response.body = create_server_response_body__data({}) as any

	await next()

	const body: OAServerResponseBody<any> = response.body as any


	//body.side

	// add side infos TODO
	//body.side.latest_news = body.side.latest_news || []

	// add meta
	//body.meta.processing_time_ms = get_UTC_timestamp_ms() - SESSION_START_TIME_MS
	//body.meta.request_summary = `${event.httpMethod.toUpperCase()}:${event.path}`
}
