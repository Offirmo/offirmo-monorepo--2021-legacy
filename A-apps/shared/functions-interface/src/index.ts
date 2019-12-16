import { URL } from 'url'

import { Enum } from 'typescript-string-enums'
import { overrideHook } from '@offirmo/universal-debug-api-placeholder'


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
	'error',
	'hello',
	'report-error',
	'tbrpg-rpc',
	'test',
	'whoami',
)
export type Endpoint = Enum<typeof Endpoint> // eslint-disable-line no-redeclar


function _get_base_url(channel: ReleaseChannel): string {
	switch(channel) {
		case 'dev':
			return 'http://localhost:9000'
		case 'staging':
			return 'https://offirmo-monorepo.netlify.com/.netlify/functions'
		case 'prod':
			return 'https://www.online-adventur.es/.netlify/functions'
		default:
			throw new Error(`functions interface: no base URL for channel "${channel}"!`)
	}
}

export function get_allowed_origin(channel: ReleaseChannel): string {
	switch(channel) {
		case 'dev':
			return 'http://localhost:8080'
		case 'staging':
			return 'https://offirmo-monorepo.netlify.com'
		case 'prod':
			return 'https://www.online-adventur.es'
		default:
			throw new Error(`functions interface: no allowed origin for channel "${channel}"!`)
	}
}

export function get_base_url(channel: ReleaseChannel): string {
	return overrideHook<string>('fn-base-url', _get_base_url(channel))
}
