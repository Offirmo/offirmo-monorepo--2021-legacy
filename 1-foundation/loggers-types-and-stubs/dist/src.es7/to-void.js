const stub = () => { };
const alert = stub;
const crit = stub;
const debug = stub;
const emerg = stub;
const error = stub;
const fatal = stub;
const info = stub;
const log = stub;
const notice = stub;
const silly = stub;
const trace = stub;
const verbose = stub;
const warn = stub;
const warning = stub;
const simpleLoggerToVoid = {
    log,
    info,
    warn,
    error,
};
const consoleLoggerToVoid = Object.assign({}, console, {
    debug,
    log,
    info,
    warn,
    error,
    trace,
});
const syslogLoggerToVoid = {
    emerg,
    alert,
    crit,
    error,
    warning,
    notice,
    info,
    debug,
};
const log4jLoggerToVoid = {
    fatal,
    error,
    warn,
    info,
    debug,
    trace,
};
const serverLoggerToVoid = log4jLoggerToVoid;
const npmLoggerToVoid = {
    error,
    warn,
    info,
    debug,
    verbose,
    silly,
};
const angularJSLoggerToVoid = {
    error,
    warn,
    info,
    debug,
};
const bunyanLoggerToVoid = {
    fatal,
    error,
    warn,
    info,
    debug,
    trace,
};
const compatibleLoggerToVoid = {
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
export { simpleLoggerToVoid, consoleLoggerToVoid, syslogLoggerToVoid, log4jLoggerToVoid, serverLoggerToVoid, npmLoggerToVoid, angularJSLoggerToVoid, bunyanLoggerToVoid, compatibleLoggerToVoid, };
//# sourceMappingURL=to-void.js.map