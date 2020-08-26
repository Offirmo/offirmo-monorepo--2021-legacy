import { XXError } from './types'
import { COMMON_ERROR_FIELDS_EXTENDED } from './fields'


// Anything can be thrown: undefined, string, number...)
// But that's obviously not a good practice.
// Normalize any thrown object into a true, normal error.
// XXX will re-create the
export function normalizeError(err_like: Readonly<Partial<Error>> = {}): XXError {
	// Erro-like objects are sometime fancy!
	// - seen: in browser, sometimes, an error-like, un-writable object is thrown
	// - seen: frozen
	// - seen: non-enumerable props
	// So we want to ensure a true, safe, writable error object.

	// Yes, we always re-create in case
	const p = Object.getPrototypeOf(err_like)
	// should we restrict to global standard constructors? TBD
	const constructor = (p?.constructor?.name?.endsWith('Error')) ? p.constructor : Error
	// https://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
	const true_err: XXError = new (Function.prototype.bind.call(constructor, null, err_like.message || `(non-error caught: "${err_like}")`))
	/*const true_err: XXError = new Error(
		err_like.message || `(non-error caught: "${err_like}")`,
	)*/

	// properly attach fields if they exist
	COMMON_ERROR_FIELDS_EXTENDED.forEach(prop => {
		//if (prop in err_like)
		if ((err_like as any)[prop])
			(true_err as any)[prop] = (err_like as any)[prop]
	})

	return true_err
}
