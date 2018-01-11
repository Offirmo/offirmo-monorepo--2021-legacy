const log = console.log.bind(console);
const info = console.info.bind(console);
const warn = console.warn.bind(console);
const error = console.error.bind(console);
const alert = error;
const crit = error;
const debug = log;
const emerg = error;
const fatal = error;
const notice = info;
const silly = log;
const trace = log;
const verbose = log;
const warning = warn;
const simpleLoggerToConsole = {
    log,
    info,
    warn,
    error,
};
const consoleLoggerToConsole = console;
const syslogLoggerToConsole = {
    emerg,
    alert,
    crit,
    error,
    warning,
    notice,
    info,
    debug,
};
const log4jLoggerToConsole = {
    fatal,
    error,
    warn,
    info,
    debug,
    trace,
};
const serverLoggerToConsole = log4jLoggerToConsole; // alias
const npmLoggerToConsole = {
    error,
    warn,
    info,
    debug,
    verbose,
    silly,
};
const angularJSLoggerToConsole = {
    error,
    warn,
    info,
    debug,
};
const bunyanLoggerToConsole = {
    fatal: (x, ...args) => fatal(...bunyan_args_harmonizer(x, ...args)),
    error: (x, ...args) => error(...bunyan_args_harmonizer(x, ...args)),
    warn: (x, ...args) => warn(...bunyan_args_harmonizer(x, ...args)),
    info: (x, ...args) => info(...bunyan_args_harmonizer(x, ...args)),
    debug: (x, ...args) => debug(...bunyan_args_harmonizer(x, ...args)),
    trace: (x, ...args) => trace(...bunyan_args_harmonizer(x, ...args)),
};
function bunyan_args_harmonizer(arg1, ...other_args) {
    if (arg1 instanceof Error) {
        const err = arg1;
        return other_args.concat({ err });
    }
    if (typeof arg1 !== 'string') {
        const details = arg1;
        return other_args.concat(details);
    }
    // no change
    return [arg1].concat(...other_args);
}
const compatibleLoggerToConsole = {
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
};
export { simpleLoggerToConsole, consoleLoggerToConsole, syslogLoggerToConsole, log4jLoggerToConsole, serverLoggerToConsole, npmLoggerToConsole, angularJSLoggerToConsole, bunyanLoggerToConsole, compatibleLoggerToConsole, };
//# sourceMappingURL=to-console.js.map