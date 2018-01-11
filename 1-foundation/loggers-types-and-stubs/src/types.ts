

// for most simple cases
// subset of Console for easy plugging
interface SimpleLogger {
	log(message?: any, ...optionalParams: any[]): void
	info(message?: any, ...optionalParams: any[]): void
	warn(message?: any, ...optionalParams: any[]): void
	error(message?: any, ...optionalParams: any[]): void
}

// https://developer.mozilla.org/en/docs/Web/API/console
type JSConsoleLogger = Console

// https://tools.ietf.org/html/rfc5424
interface SyslogLogger {
	emerg(message?: any, ...optionalParams: any[]): void
	alert(message?: any, ...optionalParams: any[]): void
	crit(message?: any, ...optionalParams: any[]): void
	error(message?: any, ...optionalParams: any[]): void
	warning(message?: any, ...optionalParams: any[]): void
	notice(message?: any, ...optionalParams: any[]): void
	info(message?: any, ...optionalParams: any[]): void
	debug(message?: any, ...optionalParams: any[]): void
}

// https://logging.apache.org/log4j/1.2/apidocs/org/apache/log4j/Level.html
// https://en.wikipedia.org/wiki/Log4j#Log4j_log_levels
interface Log4jLogger {
	fatal(message?: any, ...optionalParams: any[]): void
	error(message?: any, ...optionalParams: any[]): void
	warn(message?: any, ...optionalParams: any[]): void
	info(message?: any, ...optionalParams: any[]): void
	debug(message?: any, ...optionalParams: any[]): void
	trace(message?: any, ...optionalParams: any[]): void
}
// alias for susceptibilities ;)
type ServerLogger = Log4jLogger

interface NpmLogger {
	error(message?: any, ...optionalParams: any[]): void
	warn(message?: any, ...optionalParams: any[]): void
	info(message?: any, ...optionalParams: any[]): void
	debug(message?: any, ...optionalParams: any[]): void
	verbose(message?: any, ...optionalParams: any[]): void
	silly(message?: any, ...optionalParams: any[]): void
}

interface AngularJSLogger {
	error(message?: any, ...optionalParams: any[]): void
	warn(message?: any, ...optionalParams: any[]): void
	info(message?: any, ...optionalParams: any[]): void
	debug(message?: any, ...optionalParams: any[]): void
}

// see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/bunyan/index.d.ts
interface BunyanLogger {
	fatal(error: Error, ...params: any[]): void
	fatal(obj: Object, ...params: any[]): void
	fatal(format: any, ...params: any[]): void

	error(error: Error, ...params: any[]): void
	error(obj: Object, ...params: any[]): void
	error(format: any, ...params: any[]): void

	warn(error: Error, ...params: any[]): void
	warn(obj: Object, ...params: any[]): void
	warn(format: any, ...params: any[]): void

	info(error: Error, ...params: any[]): void
	info(obj: Object, ...params: any[]): void
	info(format: any, ...params: any[]): void

	debug(error: Error, ...params: any[]): void
	debug(obj: Object, ...params: any[]): void
	debug(format: any, ...params: any[]): void

	trace(error: Error, ...params: any[]): void
	trace(obj: Object, ...params: any[]): void
	trace(format: any, ...params: any[]): void
}

// happily accepts any of the above
interface CompatibleLogger {
	alert(...params: any[]): void
	crit(...params: any[]): void
	debug(...params: any[]): void
	emerg(...params: any[]): void
	error(...params: any[]): void
	fatal(...params: any[]): void
	info(...params: any[]): void
	log(...params: any[]): void
	notice(...params: any[]): void
	silly(...params: any[]): void
	trace(...params: any[]): void
	verbose(...params: any[]): void
	warn(...params: any[]): void
	warning(...params: any[]): void
}


export {
	SimpleLogger,
	JSConsoleLogger,
	SyslogLogger,
	Log4jLogger,
	ServerLogger,
	NpmLogger,
	AngularJSLogger,
	BunyanLogger,
	CompatibleLogger,
}
