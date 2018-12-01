/// <reference types="node" />
interface SimpleLogger {
    log(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
    info(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
    warn(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
    error(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
}
declare type JSConsoleLogger = Console;
interface SyslogLogger {
    emerg(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
    alert(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
    crit(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
    error(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
    warning(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
    notice(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
    info(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
    debug(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
}
interface Log4jLogger {
    fatal(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
    error(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
    warn(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
    info(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
    debug(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
    trace(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
}
declare type ServerLogger = Log4jLogger;
interface NpmLogger {
    error(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
    warn(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
    info(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
    debug(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
    verbose(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
    silly(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
}
interface AngularJSLogger {
    error(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
    warn(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
    info(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
    debug(message?: Readonly<any>, ...optionalParams: Readonly<any>[]): void;
}
interface BunyanLogger {
    fatal(error: Readonly<Error>, ...params: Readonly<any>[]): void;
    fatal(obj: Readonly<Object>, ...params: Readonly<any>[]): void;
    fatal(format: Readonly<any>, ...params: Readonly<any>[]): void;
    error(error: Readonly<Error>, ...params: Readonly<any>[]): void;
    error(obj: Readonly<Object>, ...params: Readonly<any>[]): void;
    error(format: Readonly<any>, ...params: Readonly<any>[]): void;
    warn(error: Readonly<Error>, ...params: Readonly<any>[]): void;
    warn(obj: Readonly<Object>, ...params: Readonly<any>[]): void;
    warn(format: Readonly<any>, ...params: Readonly<any>[]): void;
    info(error: Readonly<Error>, ...params: Readonly<any>[]): void;
    info(obj: Readonly<Object>, ...params: Readonly<any>[]): void;
    info(format: Readonly<any>, ...params: Readonly<any>[]): void;
    debug(error: Readonly<Error>, ...params: Readonly<any>[]): void;
    debug(obj: Readonly<Object>, ...params: Readonly<any>[]): void;
    debug(format: Readonly<any>, ...params: Readonly<any>[]): void;
    trace(error: Readonly<Error>, ...params: Readonly<any>[]): void;
    trace(obj: Readonly<Object>, ...params: Readonly<any>[]): void;
    trace(format: Readonly<any>, ...params: Readonly<any>[]): void;
}
interface CompatibleLogger {
    alert(...params: Readonly<any>[]): void;
    crit(...params: Readonly<any>[]): void;
    debug(...params: Readonly<any>[]): void;
    emerg(...params: Readonly<any>[]): void;
    error(...params: Readonly<any>[]): void;
    fatal(...params: Readonly<any>[]): void;
    info(...params: Readonly<any>[]): void;
    log(...params: Readonly<any>[]): void;
    notice(...params: Readonly<any>[]): void;
    silly(...params: Readonly<any>[]): void;
    trace(...params: Readonly<any>[]): void;
    verbose(...params: Readonly<any>[]): void;
    warn(...params: Readonly<any>[]): void;
    warning(...params: Readonly<any>[]): void;
}
export { SimpleLogger, JSConsoleLogger, SyslogLogger, Log4jLogger, ServerLogger, NpmLogger, AngularJSLogger, BunyanLogger, CompatibleLogger, };
