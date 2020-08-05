/* eslint-disable no-console */
import chalk from 'chalk'

import { COMMON_ERROR_FIELDS_EXTENDED } from '@offirmo-private/common-error-fields'
import { inject_chalk, to_prettified_str } from '@offirmo-private/prettify-any'
import { displayError } from '@offirmo-private/print-error-to-ansi'

inject_chalk(chalk)

import {
	LogPayload,
	LogSink,
	LogDetails,
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

		let line = ''
			+ (displayTime
				? (chalk.dim(String(time)) + ' ')
				: '')
			+ LEVEL_TO_ASCII[level]
			+ '› '
			+ LEVEL_TO_STYLIZE[level](''
				+ name
				+ (name ? '›' : '')
				+ (msg ? ' ' : '')
				+ msg
			)


			+ (
				Reflect.ownKeys(details).length === 0
					? ''
					//: (' ' + JSON.stringify(details))
					: (' ' + to_prettified_str(details, {
						line_width:
						first_line_already_used:
					}))
			)
		console.log(line) // eslint-disable-line no-console
		if (err)
			displayError(err)
	}
}

export default createSink
