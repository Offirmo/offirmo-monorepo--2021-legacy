
export const LEVEL_TO_CONSOLE_METHOD: Readonly<{ [k: string]: string }> = {
	fatal:   'error',
	emerg:   'error',
	alert:   'error',
	crit:    'error',

	error:   'error',

	warning: 'warn',
	warn:    'warn',

	notice:  'info',
	info:    'info',
	verbose: 'info',

	log:     'log',

	debug:   'debug',
	trace:   'debug',
	silly:   'debug',
}
