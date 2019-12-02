////////////////////////////////////

import {
	Handler,
	Context,
	ClientContext,
	Callback,
	APIGatewayEvent,
} from 'aws-lambda'

////////////////////////////////////

interface Response {
	statusCode: number;
	body: string;
}

type NetlifyHandler = Handler<APIGatewayEvent, Response>

// Re-typing of the context according to what we really see
interface NetlifyContext extends Omit<Omit<Context, 'identity'>, 'clientContext'> {
	clientContext: NetlifyClientContext;
}

interface NetlifyClientContext extends Omit<ClientContext, 'env'> {
	custom: unknown
	identity: unknown
	user?: {
		app_metadata: {
			provider: string
			roles?: string[]
		},
		email: string,
		sub: string // seems to be an UUID
		user_metadata: {
			avatar_url?: string
			full_name?: string
		}
	}
}

////////////////////////////////////

export {
	APIGatewayEvent,
	Context,
	NetlifyContext,
	NetlifyClientContext,
	Response,
	NetlifyHandler,
}
