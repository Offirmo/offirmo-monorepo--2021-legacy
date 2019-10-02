import {
	APIGatewayEvent,
	Context,
	Response,
	NetlifyHandler,
} from './sub/types'

const handler: NetlifyHandler = async (
	event: APIGatewayEvent,
	context: Context,
): Promise<Response> => {
	throw new Error('TEST ERROR!')

	// https://devdocs.io/node/process#process_process_env
	// process.setUncaughtExceptionCaptureCallback(fn)

	//return new Error('TEST ERROR 2!')
}

export { handler }
