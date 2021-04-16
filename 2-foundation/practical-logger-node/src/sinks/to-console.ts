/* eslint-disable no-console */
import chalk from 'chalk'

import { inject_lib__chalk, prettify_any } from '@offirmo-private/prettify-any'
import { displayError } from '@offirmo-private/print-error-to-ansi'

inject_lib__chalk(chalk)

import {
	LogPayload,
	LogSink,
} from '@offirmo/practical-logger-types'

import { SinkOptions } from '../types'

import {
	LEVEL_TO_ASCII,
	LEVEL_TO_STYLIZE,
} from './common'

export function createSink(options: Readonly<SinkOptions> = {}): LogSink {
	const displayTime = options.displayTime || false

	return (payload: LogPayload): void => {
		const { level, name, msg, time, details, err } = payload

		let line = [
				displayTime ? chalk.dim(String(time)) : '',
				LEVEL_TO_ASCII[level] + '›',
				LEVEL_TO_STYLIZE[level]([
						name,
						msg
					].filter(x => !!x).join('› ')
				),
				Reflect.ownKeys(details).length === 0
					? ''
					//: (' ' + JSON.stringify(details))
					: prettify_any(details, {
						//line_width:
						//first_line_already_used:
					}),
			].filter(x => !!x).join(' ')

		console.log(line) // eslint-disable-line no-console
		if (err)
			displayError(err)
	}
}

export default createSink
