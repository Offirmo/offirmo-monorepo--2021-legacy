import {
	LogPayload,
	LogSink,
} from '@offirmo/practical-logger-types'

import { SinkOptions } from '../types'
import { LEVEL_TO_CONSOLE_METHOD, to_uniform_level } from './common'


export default function create(options: Readonly<SinkOptions> = {}): LogSink {
	return (payload: LogPayload): void => {
		const { level, name, msg, err, details } = payload
		const console_method_name: string = LEVEL_TO_CONSOLE_METHOD[level]
		const console_method: Console['log'] = (console as any)[console_method_name]

		const line = ['[', to_uniform_level(level), '] ']

		if (name) {
			line.push(`${name} › `)
		}
		line.push(msg)

		const args: any[] = line
		if (Object.keys(details).length)
			args.push(details)
		// err should be last because it takes a lot of room and "hides" further args
		if (err)
			args.push(err)

		console_method(...args)
	}
}
