// see https://www.netlify.com/docs/functions/

import {
	APIGatewayEvent,
	Context,
	Response,
	NetlifyHandler,
} from './sub/types'

import { capitalize } from './sub'

const handler: NetlifyHandler = async (): Promise<Response> => {

	return {
		statusCode: 200,
		body: capitalize('LODASH'),
	}
}

export { handler }
