import { Enum } from 'typescript-string-enums'
import { overrideHook } from '@offirmo/universal-debug-api-placeholder'

const LIB = 'functions interface'

// tslint:disable-next-line: variable-name
export const ReleaseChannel = Enum(
	'prod',
	'staging',
	'dev',
)
export type ReleaseChannel = Enum<typeof ReleaseChannel> // eslint-disable-line no-redeclar


// tslint:disable-next-line: variable-name
export const Endpoint = Enum(
	'echo',
	'hello-world',
	'hello-world-advanced',
	'report-error',
	'tbrpg-rpc',
	'temp',
	'test-error-handling',
	'whoami',
)
export type Endpoint = Enum<typeof Endpoint> // eslint-disable-line no-redeclar


export function get_allowed_origin(channel: ReleaseChannel): string {
	switch(channel) {
		case 'dev':
			return 'http://localhost:8080'
		case 'staging':
			return 'https://offirmo-monorepo.netlify.app'
		case 'prod':
			return 'https://www.online-adventur.es'
		default:
			throw new Error(`[${LIB}] no allowed origin for channel "${channel}"!`)
	}
}

function _get_api_base_url(channel: ReleaseChannel): string {
	switch(channel) {
		case 'dev':
			return 'http://localhost:9000'
		case 'staging':
			return 'https://offirmo-monorepo.netlify.app/.netlify/functions'
		case 'prod':
			return 'https://www.online-adventur.es/.netlify/functions'
		default:
			if ((channel as any) === 'unknown')
				return 'http://test.test'
			throw new Error(`[${LIB}] no base URL for channel "${channel}"!`)
	}
}

export function get_api_base_url(channel: ReleaseChannel): string {
	return overrideHook<string>('api-base-url', _get_api_base_url(channel))
}
