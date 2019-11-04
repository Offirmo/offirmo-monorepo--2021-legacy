import { ENV_ROOT } from '../consts'

export { ENV_ROOT } from '../consts'

export function getOverrideKeyForLogger(name: string): string {
	return `logger.${name || 'default'}.logLevel`
}

export function getEnvKeyForOverride(key: string): string {
	// should we put v1 somewhere? no, most likely overkill.
	return `${ENV_ROOT}.override.${key}`
}
