import memoize_one from 'memoize-one'
import { Enum } from 'typescript-string-enums'
import assert from 'tiny-invariant'

import { HTTP_STATUS_CODE } from '../consts'
import { create_error } from '../utils'
import { APIGatewayEvent, XSoftExecutionContext, NetlifyContext, Response} from './types'

////////////////////////////////////

export const FailureMode = Enum(
	'none',
	'manual',
	'assertion-sync',
	'throw-sync',
	'throw-sync-non-error',
	'throw-async',
	'timeout',
	'rejection',
	'unhandled-rejection',
	'bad-status-code',
	'non-json-stringified-body',
	'non-stringified-body',
	'non-stringifiable-body',
	'no-response-set',
)
export type FailureMode = Enum<typeof FailureMode> // eslint-disable-line no-redeclare

////////////////////////////////////

export async function test_failure(
		SEC: XSoftExecutionContext,
		event: Readonly<APIGatewayEvent>,
		context: Readonly<NetlifyContext>,
		response: Response,
		next: () => Promise<void>
): Promise<void> {
	const mode = (event.queryStringParameters && event.queryStringParameters.mode) || undefined
	const { logger } = SEC.getInjectedDependencies()

	assert(!mode || Enum.isType(FailureMode, mode), `Invalid mode, should be one and only one of: ` + Enum.values(FailureMode).join(', '))

	logger.info('[MW test_failure] will cause failure:', mode)

	const initial_unset_body = response.body
	// starts with a response manually set to a success,
	// to check that an error will overwrite it properly
	response.statusCode = 200
	response.body = JSON.stringify('XXX You should NOT see that, there should be an error!')

	const get_test_err = memoize_one(() => create_error(`TEST ${mode}!`, { statusCode: 555 }, SEC))

	switch (mode) {
		case undefined:
			response.statusCode = HTTP_STATUS_CODE.error.client.bad_request
			response.body = 'Error: Failure test: Please provide a failure mode: ' + Enum.values(FailureMode).join(', ')
			break

		case FailureMode['none']:
			response.statusCode = 200
			response.body = JSON.stringify('All good, test of no error')
			await next()
			break

		case FailureMode['manual']:
			// bad idea (should throw instead) but possible
			response.statusCode = get_test_err().statusCode!
			response.body = get_test_err().message
			break

		case FailureMode['assertion-sync']:
			assert(false, get_test_err().message)
			//break

		case FailureMode['throw-sync']:
			throw get_test_err()

		case FailureMode['throw-sync-non-error']:
			throw get_test_err().message // baad! throwing a string!

		case FailureMode['throw-async']:
			return new Promise(() => {
				setTimeout(() => { throw get_test_err() }, 100)
			})

		case FailureMode['timeout']:
			return new Promise(() => {
				// no resolution
			})

		case FailureMode['rejection']:
			return Promise.reject(get_test_err())

		case FailureMode['unhandled-rejection']:
			Promise.reject(get_test_err()) // unhandled
			// pretend otherwise OK
			// (already done, see above)
			await next()
			return

		case FailureMode['bad-status-code']:
			delete (response as any).body
			response.statusCode = 'foo' as any
			break

		case FailureMode['non-stringified-body']:
			response.statusCode = 200
			// eventually, decided to support this, too convenient
			// = won't result in an error
			// see also next case
			response.body = { foo: 42 } as any
			break

		case FailureMode['non-stringifiable-body']:
			// auto-stringification ust be possible
			const foo: any = { val: 42 }
			foo.foo = foo
			response.statusCode = 200
			response.body = {
				recurse: foo,
				//'this can’t be stringified!': 2n,
			} as any
			break

		case FailureMode['non-json-stringified-body']:
			response.statusCode = 200
			// body should always be JSON.parse()-able
			response.body = "this is bad!"
			break

		case FailureMode['no-response-set']:
			// pretend we didn't set the body
			response.body = initial_unset_body
			break

		default:
			// should have been caught earlier
			throw new Error('Should never happen!')
	}
}
