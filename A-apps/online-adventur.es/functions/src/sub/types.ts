////////////////////////////////////

import {
	Handler,
	Context,
	ClientContext,
	APIGatewayEvent,
} from 'aws-lambda'

////////////////////////////////////

// https://docs.netlify.com/functions/build-with-javascript/#format
interface Response {
	isBase64Encoded?: boolean
	statusCode: number
	headers: {
		[k: string]: string
	}
	body: string
}

type NetlifyHandler = Handler<APIGatewayEvent, Response>

// Re-typing of the context according to what we really see
interface NetlifyContext extends Omit<Omit<Context, 'identity'>, 'clientContext'> {
	clientContext: NetlifyClientContext
}

interface NetlifyClientContext extends Omit<ClientContext, 'env'> {
	custom: unknown
	identity: unknown
	user?: {
		app_metadata: {
			provider: string
			roles?: string[]
		}
		email: string
		exp: number // seems to be a timestamp
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
