export const STANDARD_ERROR_FIELDS = new Set<string>([

	// standard fields
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
	'name',
	'message',

	// quasi-standard
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
	'stack',
])

export const COMMON_ERROR_FIELDS = new Set<string>([

	//...STANDARD_ERROR_FIELDS, // no, conv to array needed due to a babel bug 😢
	...Array.from(STANDARD_ERROR_FIELDS.keys()),

	// standard in node
	'code', // https://medium.com/the-node-js-collection/node-js-errors-changes-you-need-to-know-about-dc8c82417f65
			  // https://nodejs.org/dist/latest/docs/api/errors.html#errors_node_js_error_codes

	// non standard but widely used
	'statusCode', // express, https://gist.github.com/zcaceres/2854ef613751563a3b506fabce4501fd
	'shouldRedirect', // express, https://gist.github.com/zcaceres/2854ef613751563a3b506fabce4501fd
	'framesToPop', // see facebook https://github.com/facebook/flux/blob/2.0.2/src/invariant.js

	// My (Offirmo) extensions
	'details',
	'SEC',
	'_temp', // used for passing state around between decorators
])
