import { Enum } from 'typescript-string-enums'

import { MiddleWare, APIGatewayEvent, XSoftExecutionContext, NetlifyContext, Response} from './types'
import { create_error } from '../utils'


export const HttpMethod = Enum(
	'GET',
	'PUT',
)
export type HttpMethod = Enum<typeof HttpMethod> // eslint-disable-line no-redeclare



export function require_http_method(required_method: HttpMethod): MiddleWare {
	return async (
		SEC: XSoftExecutionContext,
		event: Readonly<APIGatewayEvent>,
		context: Readonly<NetlifyContext>,
		response: Response,
		next: () => Promise<void>
	): Promise<void> => {
		if (event.httpMethod.toUpperCase() !== required_method)
			throw create_error(405)

		await next()
	}
}
