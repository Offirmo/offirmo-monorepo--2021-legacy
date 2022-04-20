import {
	APIGatewayEvent,
	NetlifyContext,
	Response,
} from '../types'

import { XSoftExecutionContext } from '../services/sec'

////////////////////////////////////

export type MiddleWare = (
	SEC: XSoftExecutionContext,
	event: Readonly<APIGatewayEvent>,
	context: Readonly<NetlifyContext>,
	response: Response,
	next: () => Promise<void>
) =>  Promise<void>

////////////////////////////////////

// for convenience
export {
	XSoftExecutionContext,
	APIGatewayEvent,
	NetlifyContext,
	Response,
}
