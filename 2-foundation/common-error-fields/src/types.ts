
interface XError extends Error {
	name: string
	message: string

	stack?: string

	// see comments in field-set.ts
	statusCode?: number
	shouldRedirect?: boolean
	framesToPop?: number

	details?: { [k: string]: boolean | number | string | null }
	SEC?: any
	_temp?: any

	// TODO triage?
}

export {
	XError,
}
