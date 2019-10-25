/* eslint-disable no-console */
import chalk from 'chalk'
import indent_string from 'indent-string'
import {
	LogPayload,
	LogSink,
} from '@offirmo/practical-logger-types'

import {
	LEVEL_TO_ASCII,
	LEVEL_TO_STYLIZE,
} from './common'


const COMMON_ERROR_FIELDS = [
	// standard fields
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
	'name',
	'message',

	// quasi-standard
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
	'stack',

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
]

function displayErrProp(errLike: Readonly<any>, prop: string) {
	if (prop === 'details') {
		const details: { [key: string]: any} = errLike.details
		console.error(chalk.red(chalk.dim(`🔥  ${prop}:`)))
		Object.entries(details).forEach(([key, value]) => {
			console.error(chalk.red(chalk.dim(`    ${key}: "`) + value + chalk.dim('"')))
		})
	}
	else
		console.error(chalk.red(chalk.dim(`🔥  ${prop}: "`) + errLike[prop] + chalk.dim('"')))
}

function displayError(errLike: Readonly<Partial<Error>> = {}) {
	console.error(chalk.red(`🔥🔥🔥🔥🔥🔥🔥  ${chalk.bold(errLike.name || 'Error')} 🔥🔥🔥🔥🔥🔥🔥`))

	const displayedProps = new Set()
	displayedProps.add('name')

	if (errLike.message) {
		displayErrProp(errLike, 'message')
		displayedProps.add('message')
	}
	if ((errLike as any).details) {
		displayErrProp(errLike, 'details')
		displayedProps.add('details')
	}
	if ((errLike as any).logicalStack) {
		displayErrProp(errLike, 'logicalStack')
		displayedProps.add('logicalStack')
	}

	COMMON_ERROR_FIELDS.forEach(prop => {
		if (prop in errLike && !displayedProps.has(prop)) {
			displayErrProp(errLike, prop)
		}
	})
}

console.log('public sink!')

export const sink: LogSink = (payload: LogPayload): void => {
	const { level, name, msg, time, details, err } = payload

	const prettified_details = JSON.stringify(details)

	const line = ''
		// TODO evaluate if time display is needed
		//+ chalk.dim(String(time))
		//+ ' '
		+ LEVEL_TO_ASCII[level]
		+ '› '
		+ LEVEL_TO_STYLIZE[level](''
			+ name
			+ (name ? '›' : '')
			+ (msg ? ' ' : '')
			+ msg
		)
		+ (
			prettified_details !== '{}'
				? (' ' + prettified_details)
				: ''
		)
	console.log(line) // eslint-disable-line no-console
	if (err)
		displayError(err)
}

export default sink
