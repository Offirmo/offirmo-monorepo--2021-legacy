"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const practical_logger_core_1 = require("@offirmo/practical-logger-core");
exports.createChildLogger = practical_logger_core_1.createChildLogger;
const LEVEL_TO_CONSOLE_METHOD = {
    [practical_logger_core_1.LogLevel.fatal]: 'error',
    [practical_logger_core_1.LogLevel.emerg]: 'error',
    [practical_logger_core_1.LogLevel.alert]: 'error',
    [practical_logger_core_1.LogLevel.crit]: 'error',
    [practical_logger_core_1.LogLevel.error]: 'error',
    [practical_logger_core_1.LogLevel.warning]: 'warn',
    [practical_logger_core_1.LogLevel.warn]: 'warn',
    [practical_logger_core_1.LogLevel.notice]: 'info',
    [practical_logger_core_1.LogLevel.info]: 'info',
    [practical_logger_core_1.LogLevel.verbose]: 'info',
    [practical_logger_core_1.LogLevel.log]: 'log',
    // note: console.debug doesn't display anything on Chrome, don't use it
    [practical_logger_core_1.LogLevel.debug]: 'log',
    [practical_logger_core_1.LogLevel.trace]: 'log',
    [practical_logger_core_1.LogLevel.silly]: 'log',
};
const LEVEL_TO_STYLE = {
    [practical_logger_core_1.LogLevel.fatal]: '',
    [practical_logger_core_1.LogLevel.emerg]: '',
    [practical_logger_core_1.LogLevel.alert]: '',
    [practical_logger_core_1.LogLevel.crit]: '',
    [practical_logger_core_1.LogLevel.error]: '',
    [practical_logger_core_1.LogLevel.warning]: '',
    [practical_logger_core_1.LogLevel.warn]: '',
    [practical_logger_core_1.LogLevel.notice]: 'color: #659AD2',
    [practical_logger_core_1.LogLevel.info]: 'color: #659AD2',
    [practical_logger_core_1.LogLevel.verbose]: 'color: #659AD2',
    [practical_logger_core_1.LogLevel.log]: '',
    [practical_logger_core_1.LogLevel.debug]: '',
    [practical_logger_core_1.LogLevel.trace]: 'color: #9AA2AA',
    [practical_logger_core_1.LogLevel.silly]: 'color: #9AA2AA',
};
function createLogger(p) {
    function outputFn(payload) {
        const { level, name, msg, time, details } = payload;
        //const { err, ...detailsNoErr } = details
        let line = ''
            //+ time
            //+ ' '
            + `%c[${level}]`
            + '›'
            + name
            + ': '
            //+ (msg ? ' ' : '')
            + msg;
        if (Object.keys(details).length)
            console[LEVEL_TO_CONSOLE_METHOD[level]](line, LEVEL_TO_STYLE[level], details);
        else
            console[LEVEL_TO_CONSOLE_METHOD[level]](line, LEVEL_TO_STYLE[level]);
    }
    return practical_logger_core_1.createLogger(Object.assign({}, p, { outputFn }));
}
exports.createLogger = createLogger;
//# sourceMappingURL=index.js.map