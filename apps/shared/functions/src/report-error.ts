import {
	APIGatewayEvent,
	Context,
	Response,
	NetlifyHandler,
} from './sub/types'
import { on_error as report_to_sentry } from './sub/services/sentry'

const handler: NetlifyHandler = async (
	event: APIGatewayEvent,
	badly_typed_context: Context,
): Promise<Response> => {
	let message = event?.queryStringParameters?.message || 'Unknown error!'
	if (!message.endsWith('!'))
		message = message + '!'

	const err = new Error(message)
	await report_to_sentry(err)
	throw err
}

export { handler }
