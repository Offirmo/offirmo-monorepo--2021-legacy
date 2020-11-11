import { Enum } from 'typescript-string-enums'


// tslint:disable-next-line: variable-name
export const ReleaseChannel = Enum(
	'prod',
	'staging',
	'dev',
)
export type ReleaseChannel = Enum<typeof ReleaseChannel> // eslint-disable-line no-redeclar


// response assuming no errors
export interface OAResponse<T> {
	data: T, // note: flat denormalized data or graph? Graph seems to be preferred ATM

	side: {
		tbrpg?: {
			VERSION: string
			NUMERIC_VERSION: number
			latest_news: any[] // TODO refine this
		}
	}


	// pagination?
}


// raw response potentially containing an error
// that should be converted to a throw by the receiving code
export interface OAServerResponseBody<T> extends Omit<OAResponse<T>, "data"> {
	v: number,

	// either error or data, not both
	data?: T, // note: flat denormalized data or graph? Graph seems to be preferred ATM
	error?: { // if present, may be forwarded (thrown) on reception
		message: string
		logical_stack: string // some sort of stack (SEC logical stack)
		code?: string // node
	}

	// technical data, should not make it to the final caller
	meta: {
		// stats, uuid, debug, etc.
		processing_time_ms?: number
		request_summary?: string // infos on the request that triggered this
		// also seen: copyright etc.
	}
}
