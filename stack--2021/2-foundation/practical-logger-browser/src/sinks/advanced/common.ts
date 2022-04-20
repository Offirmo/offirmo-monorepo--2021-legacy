import {
	LogPayload,
} from '@offirmo/practical-logger-types'

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


function add_styled_string(line: string[], chunk: string, ...styles: string[]): string[] {
	const [ existing_chunks, ...existing_chunks_styles ] = line
	return [
		existing_chunks + '%c' + chunk,
		...existing_chunks_styles,
		styles.join(';') + ';',
	]
}

function build_args(line: any[], payload: Readonly<LogPayload>): any[] {
	const { err } = payload
	let { details } = payload

	const args = line
	if (err) {
		// err will be passed as the LAST arg for reasons (see below)
		// however the "last arg" display doesn't allow examining the optional err properties
		// so we also add the err to the details:
		// (tested on FF/Chrome/Safari)
		details = {
			...details,
			err,
		}
	}

	if (Object.keys(details).length)
		args.push(details)

	// err *as an arg* triggers a good display of the stacktrace
	// however it should be LAST because it takes a lot of room and "hides" further args
	// (tested on FF/Chrome/Safari)
	if (err)
		args.push(err)

	return args
}

export {
	FONT_FAMILY_BETTER_PROPORTIONAL,
	FONT_FAMILY_BETTER_MONOSPACE,
	LEVEL_TO_COLOR_STYLE,
	add_styled_string,
	build_args,
}
