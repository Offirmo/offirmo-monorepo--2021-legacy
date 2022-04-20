/* eslint-disable no-console */

import {
	SimpleLogger,
	JSConsoleLogger,
	SyslogLogger,
	Log4jLogger,
	NpmLogger,
	AngularJSLogger,
	BunyanLogger,
	CompatibleLogger,
} from './types'


const log = console.log.bind(console)
const info = console.info.bind(console)
const warn = console.warn.bind(console)
const error = console.error.bind(console)

const alert = error
const crit = error
const debug = log
const emerg = error
const fatal = error
const notice = info
const silly = log
const trace = log
const verbose = log
const warning = warn


const simpleLoggerToConsole: SimpleLogger = {
	log,
	info,
	warn,
	error,
}

const consoleLoggerToConsole: JSConsoleLogger = console

const syslogLoggerToConsole: SyslogLogger = {
	emerg,
	alert,
	crit,
	error,
	warning,
	notice,
	info,
	debug,
}

const log4jLoggerToConsole: Log4jLogger = {
	fatal,
	error,
	warn,
	info,
	debug,
	trace,
}
const serverLoggerToConsole = log4jLoggerToConsole // alias

const npmLoggerToConsole: NpmLogger = {
	error,
	warn,
	info,
	debug,
	verbose,
	silly,
}

const angularJSLoggerToConsole: AngularJSLogger = {
	error,
	warn,
	info,
	debug,
}


const bunyanLoggerToConsole: BunyanLogger = {
	fatal: (x: Readonly<any>, ...args: Readonly<any>[]) => fatal(...bunyan_args_harmonizer(x, ...args)),
	error: (x: Readonly<any>, ...args: Readonly<any>[]) => error(...bunyan_args_harmonizer(x, ...args)),
	warn: (x: Readonly<any>, ...args: Readonly<any>[]) => warn(...bunyan_args_harmonizer(x, ...args)),
	info: (x: Readonly<any>, ...args: Readonly<any>[]) => info(...bunyan_args_harmonizer(x, ...args)),
	debug: (x: Readonly<any>, ...args: Readonly<any>[]) => debug(...bunyan_args_harmonizer(x, ...args)),
	trace: (x: Readonly<any>, ...args: Readonly<any>[]) => trace(...bunyan_args_harmonizer(x, ...args)),
}

// TODO Readonly
function bunyan_args_harmonizer(arg1: Readonly<any>, ...other_args: Readonly<any>[]): Readonly<any>[] {
	if (arg1 instanceof Error) {
		const err = arg1
		return other_args.concat({err})
	}

	if (typeof arg1 !== 'string') {
		const details = arg1
		return other_args.concat(details)
	}

	// no change
	return [arg1, ...other_args]
}

const compatibleLoggerToConsole: CompatibleLogger = {
	alert,
	crit,
	debug,
	emerg,
	error,
	fatal,
	info,
	log,
	notice,
	silly,
	trace,
	verbose,
	warn,
	warning,
}

export {
	simpleLoggerToConsole,
	consoleLoggerToConsole,
	syslogLoggerToConsole,
	log4jLoggerToConsole,
	serverLoggerToConsole,
	npmLoggerToConsole,
	angularJSLoggerToConsole,
	bunyanLoggerToConsole,
	compatibleLoggerToConsole,
}
