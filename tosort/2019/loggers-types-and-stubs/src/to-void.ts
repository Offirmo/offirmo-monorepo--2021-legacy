
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


const stub = () => {}

const alert = stub
const crit = stub
const debug = stub
const emerg = stub
const error = stub
const fatal = stub
const info = stub
const log = stub
const notice = stub
const silly = stub
const trace = stub
const verbose = stub
const warn = stub
const warning = stub


const simpleLoggerToVoid: SimpleLogger = {
	log,
	info,
	warn,
	error,
}

const consoleLoggerToVoid: JSConsoleLogger = Object.assign({}, console, {
	debug,
	log,
	info,
	warn,
	error,
	trace, // XXX
})

const syslogLoggerToVoid: SyslogLogger = {
	emerg,
	alert,
	crit,
	error,
	warning,
	notice,
	info,
	debug,
}

const log4jLoggerToVoid: Log4jLogger = {
	fatal,
	error,
	warn,
	info,
	debug,
	trace,
}
const serverLoggerToVoid = log4jLoggerToVoid

const npmLoggerToVoid: NpmLogger = {
	error,
	warn,
	info,
	debug,
	verbose,
	silly,
}

const angularJSLoggerToVoid: AngularJSLogger = {
	error,
	warn,
	info,
	debug,
}

const bunyanLoggerToVoid: BunyanLogger = {
	fatal,
	error,
	warn,
	info,
	debug,
	trace,
}

const compatibleLoggerToVoid: CompatibleLogger = {
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
	simpleLoggerToVoid,
	consoleLoggerToVoid,
	syslogLoggerToVoid,
	log4jLoggerToVoid,
	serverLoggerToVoid,
	npmLoggerToVoid,
	angularJSLoggerToVoid,
	bunyanLoggerToVoid,
	compatibleLoggerToVoid,
}
