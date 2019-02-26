
interface XError {
	name: string
	message: string

	stack?: string

	// see comments in index.js
	statusCode?: number
	shouldRedirect?: boolean
	framesToPop?: number

	details?: { [k: string]: boolean | number | string | null }
	SEC?: any
	_temp?: any
}

export {
	XError,
}
