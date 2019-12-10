const DEFAULT_OPTIONS = {
	periodMs: 100, // check every 100ms
	timeoutMs: 10 * 1000, // after 10 seconds, timeout
	debugId: 'an unnamed predicate',
}

function poll(predicate, options) {
	// early check to save an initial poll period
	let result = predicate()
	if (result)
		return Promise.resolve(result)

	const {periodMs, timeoutMs, debugId} = Object.assign(DEFAULT_OPTIONS, options || {})

	return new Promise((resolve, reject) => {
		const waitForElement = setInterval(() => {
			result = predicate()
			if (!result) return
			clearTimeout(waitForTimeout)
			clearInterval(waitForElement)
			resolve(result)
		}, periodMs)

		const waitForTimeout = setTimeout(() => {
			clearInterval(waitForElement)
			reject(new Error(`@offirmo-private/poll: Timed out while waiting for "${debugId}"`))
		}, timeoutMs)
	})
}

export default poll
