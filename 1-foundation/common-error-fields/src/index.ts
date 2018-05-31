import { XError } from "./types"

function create(): Set<string> {
	return new Set<string>([

		// standard fields
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
		'name',
		'message',

		// quasi-standard
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
		'stack',

		// non standard but widely used
		'statusCode', // express, https://gist.github.com/zcaceres/2854ef613751563a3b506fabce4501fd
		'shouldRedirect', // express, https://gist.github.com/zcaceres/2854ef613751563a3b506fabce4501fd

		// My (Offirmo) extensions
		'details',
		'SEC',
		'_temp', // used for passing state around between decorators
	])
}

const default_instance = create()
const COMMON_ERROR_FIELDS = default_instance

export {
	XError,
	COMMON_ERROR_FIELDS,
	create,
}
