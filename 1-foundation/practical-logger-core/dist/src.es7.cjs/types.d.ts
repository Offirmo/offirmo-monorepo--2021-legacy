import { Enum } from 'typescript-string-enums';
declare const LogLevel: {
    fatal: "fatal";
    emerg: "emerg";
    alert: "alert";
    crit: "crit";
    error: "error";
    warning: "warning";
    warn: "warn";
    notice: "notice";
    info: "info";
    verbose: "verbose";
    log: "log";
    debug: "debug";
    trace: "trace";
    silly: "silly";
};
declare type LogLevel = Enum<typeof LogLevel>;
declare type Details = {
    [k: string]: any;
};
declare type LogFn = (message?: string, details?: Readonly<Details>) => void;
interface Payload {
    level: LogLevel;
    name: string;
    msg: string;
    time: string;
    err?: Error;
    details: Details;
}
declare type OutputFn = (payload: Payload) => void;
interface LogParams {
    name: string;
    level?: Readonly<LogLevel>;
    details?: Readonly<Details>;
}
interface InternalLoggerState {
    name: string;
    level: LogLevel;
    details: Details;
    outputFn: OutputFn;
}
interface Logger {
    _: InternalLoggerState;
    isLevelEnabled: (level: LogLevel) => boolean;
    setLevel: (level: LogLevel) => void;
    getLevel: () => LogLevel;
    addDetails: (hash: Details) => void;
    alert: LogFn;
    crit: LogFn;
    debug: LogFn;
    emerg: LogFn;
    error: LogFn;
    fatal: LogFn;
    info: LogFn;
    log: LogFn;
    notice: LogFn;
    silly: LogFn;
    trace: LogFn;
    verbose: LogFn;
    warn: LogFn;
    warning: LogFn;
}
export { Details, LogLevel, LogFn, OutputFn, InternalLoggerState, Logger, LogParams, Payload, };
