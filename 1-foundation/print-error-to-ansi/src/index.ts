import chalk from 'chalk'

import { COMMON_ERROR_FIELDS } from '@offirmo/common-error-fields'

function displayErrProp(errLike: any, prop: string) {
	console.error(chalk.red(chalk.dim(`🔥  ${prop}: "`) + errLike[prop] + chalk.dim('"')))
}

function displayError(errLike: Partial<Error> = {}) {
	console.error(chalk.red(`🔥🔥🔥🔥🔥🔥🔥  ${chalk.bold(errLike.name || 'Error')} 🔥🔥🔥🔥🔥🔥🔥`))

	const displayedProps = new Set()
	displayedProps.add('name')

	if (errLike.message) {
		displayErrProp(errLike, 'message')
		displayedProps.add('message')
	}
	if ((errLike as any).logicalStack) {
		displayErrProp(errLike, 'logicalStack')
		displayedProps.add('logicalStack')
	}

	COMMON_ERROR_FIELDS.forEach(prop => {
		if (prop in errLike && !displayedProps.has(prop))
			displayErrProp(errLike, prop)
	})
}


export {
	displayError,
}
