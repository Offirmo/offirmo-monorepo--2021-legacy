
// https://2ality.com/2017/08/promise-try.html#work-arounds
function promiseTry<T>(fn: () => T | PromiseLike<T>): Promise<T> {
	return Promise.resolve().then(fn)
}

export {
	promiseTry,
}
