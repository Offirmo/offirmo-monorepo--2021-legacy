/* This is a private, non-exposed sink for my own (Offirmo) private usage.
 * Nothing to see here.
 */
import indent_string from 'indent-string'
import {
	LogPayload,
	LogSink,
} from '@offirmo/practical-logger-types'
import { displayError } from '@offirmo-private/print-error-to-ansi'
import prettifyJson from '@offirmo-private/prettify-json'

import {
	LEVEL_TO_ASCII,
	LEVEL_TO_STYLIZE,
} from './common'


export const sink: LogSink = (payload: LogPayload): void => {
	const { level, name, msg, time, details, err } = payload

	const prettified_details = prettifyJson(details)
	const is_prettified_details_multiline = prettified_details.includes('\n')

	const line = ''
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
			prettified_details
				? is_prettified_details_multiline
					? ' {\n' + indent_string(prettified_details, 2) + '\n}'
					: ' { ' + prettified_details + ' }'
				: ''
		)
	console.log(line) // eslint-disable-line no-console
	if (err)
		displayError(err)
}

export default sink
