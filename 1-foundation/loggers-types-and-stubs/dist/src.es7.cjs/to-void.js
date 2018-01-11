"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.simpleLoggerToVoid = simpleLoggerToVoid;
const consoleLoggerToVoid = Object.assign({}, console, {
    debug,
    log,
    info,
    warn,
    error,
    trace,
});
exports.consoleLoggerToVoid = consoleLoggerToVoid;
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
exports.syslogLoggerToVoid = syslogLoggerToVoid;
const log4jLoggerToVoid = {
    fatal,
    error,
    warn,
    info,
    debug,
    trace,
};
exports.log4jLoggerToVoid = log4jLoggerToVoid;
const serverLoggerToVoid = log4jLoggerToVoid;
exports.serverLoggerToVoid = serverLoggerToVoid;
const npmLoggerToVoid = {
    error,
    warn,
    info,
    debug,
    verbose,
    silly,
};
exports.npmLoggerToVoid = npmLoggerToVoid;
const angularJSLoggerToVoid = {
    error,
    warn,
    info,
    debug,
};
exports.angularJSLoggerToVoid = angularJSLoggerToVoid;
const bunyanLoggerToVoid = {
    fatal,
    error,
    warn,
    info,
    debug,
    trace,
};
exports.bunyanLoggerToVoid = bunyanLoggerToVoid;
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
exports.compatibleLoggerToVoid = compatibleLoggerToVoid;
//# sourceMappingURL=to-void.js.map