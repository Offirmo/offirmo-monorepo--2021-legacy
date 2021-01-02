import { XError, XXError } from './types'

export const STRICT_STANDARD_ERROR_FIELDS = new Set<keyof XError>([
	// standard fields
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
	'name',
	'message',
])

export const QUASI_STANDARD_ERROR_FIELDS = new Set<keyof XError>([
	// first inherit from previous
	// conv to array needed due to a babel bug 😢
	...Array.from(STRICT_STANDARD_ERROR_FIELDS),

	// quasi-standard: followed by all browsers + node
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
	'stack',
])

export const COMMON_ERROR_FIELDS = new Set<keyof XError>([
	// first inherit from previous
	// conv to array needed due to a babel bug 😢
	...Array.from(QUASI_STANDARD_ERROR_FIELDS),

	// standard in node only:
	'code', // https://medium.com/the-node-js-collection/node-js-errors-changes-you-need-to-know-about-dc8c82417f65
	        // https://nodejs.org/dist/latest/docs/api/errors.html#errors_node_js_error_codes

	// non standard but widely used:
	'statusCode', // express, https://gist.github.com/zcaceres/2854ef613751563a3b506fabce4501fd
	'shouldRedirect', // express, https://gist.github.com/zcaceres/2854ef613751563a3b506fabce4501fd
	'framesToPop', // see facebook https://github.com/facebook/flux/blob/2.0.2/src/invariant.js
])

export const COMMON_ERROR_FIELDS_EXTENDED = new Set<keyof XXError>([
	// first inherit from previous
	// conv to array needed due to a babel bug 😢
	...Array.from(COMMON_ERROR_FIELDS),

	// My (Offirmo) extensions:
	'_temp', // used for passing state around during error handling
	'details', // hash to store any other property not defined in this set

	// To evaluate if need arises:
	// TODO triage field?
	// TODO timestamp?
])
