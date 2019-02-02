import { Handler, Context, Callback, APIGatewayEvent } from 'aws-lambda'

interface Response {
	statusCode: number;
	body: string;
}

type NetlifyHandler = Handler<APIGatewayEvent, Response>

interface NetlifyIdentityContext {
	user: any
}

export {
	APIGatewayEvent,
	Context,
	NetlifyIdentityContext,

	Response,
	NetlifyHandler,
}
