

const DEBUG = true

const DEFAULT_OPTIONS: Partial<RequestInit> = {
	method: "PUT",
	/*credentials: "same-origin",
	headers: {
		"Content-Type": "application/json",
		Accept: [
			"application/json",
		],
	},*/
}

// This function returns a JSON stream which emits a single JSON value on success, and throws
// an error on failure
// Pass the headersProcessor in the options to provide a callback function which can respond on headers.
function fetch_json<T>(url: string, options: Partial<RequestInit> = {}): Promise<T> {
	let ok = false // so far
	let error_message = 'Failed fetch' // so far
	let status = 500

	return fetch(
			url,
			{
				...DEFAULT_OPTIONS,
				...options,
			}
		)
		.then((response: Response) => {
			// WARN: we can't destructure response because .json() needs a binding to response
			ok = response.ok
			status = response.status
			if (!ok)
				error_message += `, status="${status}"`

			if (response.bodyUsed)
				return response.json()

			return null
		})
		// should we catch errors here?
		.then((data: any): T => {
			// log if needed...
			return data
		})
		.catch((err: Error) => {
			ok = false; // just in case
			error_message += `, ${err.message}`
			throw new Error(error_message)
		})
		/*.finally(() => {
			if (!ok)
				throw new Error(error_message)
		})
		.catch((err: Error) => {
			if (DEBUG) console.error(url, err)
			throw err
		})*/
}

export default fetch_json
