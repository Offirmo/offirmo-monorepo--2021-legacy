import assert from 'tiny-invariant'
import { LogLevel, ALL_LOG_LEVELS, LOG_LEVEL_TO_HUMAN } from '@offirmo/practical-logger-core'

import { LIB } from '../../consts'

const FONT_FAMILY_BETTER_PROPORTIONAL = 'font-family: ' + [
	'-apple-system',
	'BlinkMacSystemFont', // good sans-serif available in blink = Chrome
	'noto',
	'roboto',
	'sans-serif',
	//'unset', // default back to the devtools one
].join(', ')

const FONT_FAMILY_BETTER_MONOSPACE = 'font-family: ' + [
	'"Fira Code"',
	'Menlo', // default chrome devtools one
	'Consolas',
	'monospace',
].join(', ')


const LEVEL_TO_COLOR_STYLE: Readonly<{ [k: string]: string }> = {
	// empty = no need, console method already covers it well
	fatal:   '',
	emerg:   '',
	alert:   '',
	crit:    '',

	error:   '',

	warning: '',
	warn:    '',

	notice:  'color: #659AD2',
	info:    'color: #659AD2',
	verbose: 'color: #659AD2',

	log:     '',

	debug:   'color: #9AA2AA',
	trace:   'color: #9AA2AA',
	silly:   'color: #9AA2AA',
}
assert(
	Object.keys(LEVEL_TO_COLOR_STYLE).sort().join(',') === [...ALL_LOG_LEVELS].sort().join(','),
	`${LIB}: LEVEL_TO_COLOR_STYLE needs an update!`
)


function add_styled_string(line: string[], chunk: string, ...styles: string[]): string[] {
	const [ existing_chunks, ...existing_chunks_styles ] = line
	return [
		existing_chunks + '%c' + chunk,
		...existing_chunks_styles,
		styles.join(';') + ';',
	]
}

const MIN_WIDTH = 5
function to_uniform_level(level: LogLevel): string {
	let str = LOG_LEVEL_TO_HUMAN[level] //.slice(0, MIN_WIDTH)
	//if (str.length < MIN_WIDTH)
	str = (str + '         ').slice(0, MIN_WIDTH)
	return str
}


export {
	FONT_FAMILY_BETTER_PROPORTIONAL,
	FONT_FAMILY_BETTER_MONOSPACE,
	LEVEL_TO_COLOR_STYLE,
	add_styled_string,
	to_uniform_level,
}
