import {
	LogPayload,
	LogSink,
} from '@offirmo-private/practical-logger-interface'

import { LEVEL_TO_CONSOLE_METHOD } from '../common'

export const sink: LogSink = (payload: LogPayload): void => {
	const { level, name, msg, time, details } = payload
	const console_method_name: string = LEVEL_TO_CONSOLE_METHOD[level]
	const console_method: Console['log'] = (console as any)[console_method_name]

	let line = ''
		//+ time
		//+ ' '
		+ `[${level}]`
		+ (name ? ` ${name} › ` : ' ')
		+ msg

	if (Object.keys(details).length)
		console_method(line, details)
	else
		console_method(line)
}

export default sink
