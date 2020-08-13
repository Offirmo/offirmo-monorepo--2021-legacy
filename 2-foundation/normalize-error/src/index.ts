import { XXError, COMMON_ERROR_FIELDS_EXTENDED } from '@offirmo-private/error-utils'

// Anything can be thrown: undefined, string, number...)
// But that's obviously not a good practice.
// Normalize any thrown object into a true, normal error.
function normalizeError(err_like: Readonly<Partial<Error>> = {}): XXError {
	// Fact: in browser, sometimes, an error-like, un-writable object is thrown

	// create a true, safe, writable error object
	const true_err: XXError = new Error(
		err_like.message || `(non-error caught: "${err_like}")`,
	)

	// properly attach fields if they exist
	COMMON_ERROR_FIELDS_EXTENDED.forEach(prop => {
		//if (prop in err_like)
		if ((err_like as any)[prop])
			(true_err as any)[prop] = (err_like as any)[prop]
	})

	return true_err
}


export default normalizeError
