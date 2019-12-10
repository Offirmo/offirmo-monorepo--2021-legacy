import { Enum } from 'typescript-string-enums'
import { overrideHook } from '@offirmo/universal-debug-api-placeholder'

export type ReleaseChannel = 'dev' | 'staging' | 'prod'

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

export function get_base_url(channel: ReleaseChannel): string {
	return overrideHook<string>('fn-base-url', _get_base_url(channel))
}
