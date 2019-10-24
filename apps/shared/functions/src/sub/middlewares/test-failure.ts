import { Enum } from 'typescript-string-enums'
import assert from 'tiny-invariant'

import { APIGatewayEvent, XSoftExecutionContext, NetlifyContext, Response} from './types'
import { create_error } from '../utils'


export const FailureMode = Enum(
	'none',
	'manual',
	'uncaught-sync',
	'uncaught-async',
	'timeout',
	'unhandled-rejection',
	'mess-with-response',
	'non-stringified-body',
)
export type FailureMode = Enum<typeof FailureMode> // eslint-disable-line no-redeclare



export async function test_failure(
		SEC: XSoftExecutionContext,
		event: Readonly<APIGatewayEvent>,
		context: Readonly<NetlifyContext>,
		response: Response,
		next: () => Promise<void>
): Promise<void> {
	const mode = (event.queryStringParameters && event.queryStringParameters.mode) || undefined

	assert(!mode || Enum.isType(FailureMode, mode), `Invalid mode, should be one of: ` + Enum.values(FailureMode).join(', '))

	console.log('Failure test:', mode)

	const test_err = create_error(`TEST ${mode}!`, { statusCode: 555 })

	switch (mode) {
		case undefined:
			response.statusCode = 400
			response.body = 'Error: Failure test: Please provide a failure mode: ' + Enum.values(FailureMode).join(', ')
			break

		case FailureMode['none']:
			response.statusCode = 200
			response.body = 'All good.'
			await next()
			break

		case FailureMode['manual']:
			response.statusCode = test_err.statusCode!
			response.body = test_err.message
			break

		case FailureMode['uncaught-sync']:
			throw test_err

		case FailureMode['uncaught-async']:
			return new Promise(() => {
				setTimeout(() => { throw test_err }, 100)
			})

		case FailureMode['timeout']:
			return new Promise(() => {
				// nothing
			})

		case FailureMode['unhandled-rejection']:
			return new Promise(() => {
				new Promise((resolve, reject) => {
					reject(test_err)
				})
			})

		case FailureMode['mess-with-response']:
			delete response.statusCode
			delete response.body
			response.statusCode = 'foo' as any
			break

		case FailureMode['non-stringified-body']:
			response.body = {
				test: 'ok'
			} as any
			break

		default:
			response.statusCode = 501
			response.body = `Failure test: mode "${mode}" not implemented!`
			break
	}
}
