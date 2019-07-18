import { LS_ROOT } from '../consts'

export { LS_ROOT } from	'../consts'

export function getOverrideKeyForLogger(name: string): string {
	return `logger.${name}.logLevel`
}

export function getLSKeyForOverride(key: string): string {
	// TODO put v1 somewhere?
	// most likely overkill.
	return `${LS_ROOT}.override.${key}`
}
