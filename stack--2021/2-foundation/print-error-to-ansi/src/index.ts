/* eslint-disable no-console */
import chalk from 'chalk'

import { COMMON_ERROR_FIELDS_EXTENDED } from '@offirmo/error-utils'

// TODO make it more pro!

function displayErrProp(errLike: Readonly<any>, prop: string) {
	if (prop === 'details') {
		const details: { [key: string]: any} = errLike.details
		console.error(chalk.red(chalk.dim(`🔥  ${prop}:`)))
		Object.entries(details).forEach(([key, value]) => {
			console.error(chalk.red(chalk.dim(`    ${key}: "`) + value + chalk.dim('"')))
		})
	}
	else if (prop === 'stack') {
		// TODO clean / shorten / relative
		console.error(chalk.red(chalk.dim(`🔥  ${prop}: "`) + errLike[prop] + chalk.dim('"')))
	}
	else
		console.error(chalk.red(chalk.dim(`🔥  ${prop}: "`) + errLike[prop] + chalk.dim('"')))
}

function displayError(errLike: Readonly<Partial<Error>> = {}) {
	console.error(chalk.red(`🔥🔥🔥🔥🔥🔥🔥  ${chalk.bold(errLike.name || 'Error')} 🔥🔥🔥🔥🔥🔥🔥`))

	// TODO use normalize error?

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

	COMMON_ERROR_FIELDS_EXTENDED.forEach(prop => {
		if (prop in errLike && !displayedProps.has(prop)) {
			displayErrProp(errLike, prop)
		}
	})
}


export {
	displayError,
}
