import { Enum } from 'typescript-string-enums'

/////////////////////////////////////////////////

export const LIB = '@online-adventur.es/api-interface'

/////////////////////////////////////////////////

export const HEADER_IMPERSONATE = "X-OFFIRMO-IMPERSONATE".toLowerCase()

// tslint:disable-next-line: variable-name
export const Endpoint = Enum(
	'whoami',
	'report-error',
	'key-value',

	// dev
	'echo',
	'hello-world',
	'hello-world-advanced',
	'test-error-handling',
	'temp',
)
export type Endpoint = Enum<typeof Endpoint> // eslint-disable-line no-redeclar

export const SERVER_RESPONSE_VERSION = 1
