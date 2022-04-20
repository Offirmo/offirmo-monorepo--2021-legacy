import { ENV_ROOT } from '../consts'

export { ENV_ROOT } from '../consts'

function normalizeKey(key: string): string {
	return key
		.split('-').join('_')
		.split('.').join('_')
		.split('⋄').join('_')
		.split('∙').join('_')
		.split('ꘌ').join('_')
		.split('ꓺ').join('_')
		.split('ː').join('_')
}

export function getOverrideKeyForLogger(name: string): string {
	return `logger_${name || 'default'}_logLevel`.toUpperCase()
}

export function getEnvKeyForOverride(key: string): string {
	// should we put v1 somewhere? no, most likely overkill.
	return `${ENV_ROOT}_override__${normalizeKey(key)}`.toUpperCase()
}
