import { LS_ROOT } from '../consts'

export function getOverrideKeyForLogger(name: string): string {
	return `logger.${name}.logLevel`
}

export function getLSKeyForOverride(key: string): string {
	return `${LS_ROOT}.override.${key}`
}
