////////////////////////////////////

import {
	Handler,
	Context,
	Callback,
	APIGatewayEvent,
} from 'aws-lambda'

////////////////////////////////////

interface Response {
	statusCode: number;
	body: string;
}

type NetlifyHandler = Handler<APIGatewayEvent, Response>

interface NetlifyIdentityContext {
	custom: unknown
	identity: unknown
	user: {
		app_metadata: {
			provider: string
			roles?: string[]
		},
		email: string,
		sub: string // seems to be an UUID
		user_metadata: {
			avatar_url: string
			full_name: string
		}
	}
}

////////////////////////////////////

export {
	APIGatewayEvent,
	Context,
	NetlifyIdentityContext,
	Response,
	NetlifyHandler,
}
