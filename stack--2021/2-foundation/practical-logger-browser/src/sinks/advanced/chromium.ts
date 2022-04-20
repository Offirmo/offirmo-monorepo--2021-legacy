import {
	LogPayload,
	LogSink,
} from '@offirmo/practical-logger-types'

import {
	LEVEL_TO_CONSOLE_METHOD,
	to_uniform_level,
} from '../common'
import {
	FONT_FAMILY_BETTER_PROPORTIONAL,
	FONT_FAMILY_BETTER_MONOSPACE,
	LEVEL_TO_COLOR_STYLE,
	add_styled_string,
	build_args,
} from './common'

function has_details_indicator(console_method_name: string): boolean {
	return console_method_name === 'error' || console_method_name === 'warn'
}

const HEADER_FONT_SIZE_STYLE = 'font-size: 8px'
const MESSAGE_FONT_SIZE_STYLE = 'font-size: 11px'

export const sink: LogSink = (payload: Readonly<LogPayload>): void => {
	const { level, name, msg, err, details: details_orginal } = payload
	const console_method_name: string = LEVEL_TO_CONSOLE_METHOD[level]
	const console_method: Console['log'] = (console as any)[console_method_name]

	let line = ['']

	if (!has_details_indicator(console_method_name)) {
		line = add_styled_string(line, '▷', LEVEL_TO_COLOR_STYLE[level], 'font-size: 8px', FONT_FAMILY_BETTER_PROPORTIONAL, 'margin-left: .1em', 'margin-right: .2em')
	}
	line = add_styled_string(line, '[', LEVEL_TO_COLOR_STYLE[level], HEADER_FONT_SIZE_STYLE, FONT_FAMILY_BETTER_PROPORTIONAL)
	line = add_styled_string(line, to_uniform_level(level), LEVEL_TO_COLOR_STYLE[level], HEADER_FONT_SIZE_STYLE, FONT_FAMILY_BETTER_MONOSPACE)
	line = add_styled_string(line, '] ', LEVEL_TO_COLOR_STYLE[level], HEADER_FONT_SIZE_STYLE, FONT_FAMILY_BETTER_PROPORTIONAL)
	line = add_styled_string(line, '', 'font-size: unset')

	if (name) {
		line = add_styled_string(line, `${name} › `, LEVEL_TO_COLOR_STYLE[level], FONT_FAMILY_BETTER_PROPORTIONAL, MESSAGE_FONT_SIZE_STYLE)
	}
	line = add_styled_string(line, msg, LEVEL_TO_COLOR_STYLE[level], FONT_FAMILY_BETTER_PROPORTIONAL, MESSAGE_FONT_SIZE_STYLE)

	console_method(...build_args(line, payload))
}

export default sink
