// explanation of the fields is in ./consts.ts

// eXtended error
export interface XError extends Error {

	// redefine the standard fields in case the target ES lib doesn't have all of them
	name: string
	message: string
	stack?: string

	// optional
	code?: string
	statusCode?: number
	shouldRedirect?: boolean
	framesToPop?: number
}

export interface XXError extends XError {

	details?: { [k: string]: boolean | number | string | null }
	SEC?: any
	_temp?: any
}
