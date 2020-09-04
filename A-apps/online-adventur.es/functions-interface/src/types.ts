import { Enum } from 'typescript-string-enums'


// tslint:disable-next-line: variable-name
export const ReleaseChannel = Enum(
	'prod',
	'staging',
	'dev',
)
export type ReleaseChannel = Enum<typeof ReleaseChannel> // eslint-disable-line no-redeclar







export interface OAServerResponseBody<T> {
	v: number,

	// either error or data, not both
	data?: T, // note: flat denormalized data or graph? Graph seems to be preferred ATM
	error?: { // if present, may be forwarded (thrown) on reception
		message: string
		logical_stack: string // some sort of stack (SEC logical stack)
		code?: string // node
	}

	side: {
		latest_news?: any[] // TODO refine this
	}

	meta: {
		// stats, uuid, debug, etc.
		processing_time_ms?: number
		// also seen: copyright etc.
		request_summary?: string // infos on the request that triggered this?
	}

	// pagination?
}

// validated response when no error
export interface OAResponse<T> {
	data: T, // note: flat denormalized data or graph? Graph seems to be preferred ATM

	side: {
		latest_news?: any[] // TODO refine this
	}

	// pagination?
}
