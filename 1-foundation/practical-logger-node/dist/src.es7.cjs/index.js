"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const practical_logger_core_1 = require("@offirmo/practical-logger-core");
exports.createChildLogger = practical_logger_core_1.createChildLogger;
const print_error_to_ansi_1 = require("@offirmo/print-error-to-ansi");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const prettyjson = require('prettyjson');
function prettifyJson(data) {
    return prettyjson.render(data, {
        keysColor: 'dim',
    });
}
const MIN_WIDTH = 7;
function to_aligned_ascii(level) {
    let lvl = level.toUpperCase();
    /*while (lvl.length <= MIN_WIDTH - 2) {
        lvl = ' ' + lvl + ' '
    }*/
    if (lvl.length < MIN_WIDTH)
        lvl = (lvl + '         ').slice(0, MIN_WIDTH);
    return lvl;
}
const LEVEL_TO_ASCII = {
    [practical_logger_core_1.LogLevel.fatal]: chalk_1.default.bgRed.white.bold(to_aligned_ascii(' ' + practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.fatal])),
    [practical_logger_core_1.LogLevel.emerg]: chalk_1.default.bgRed.white.bold(to_aligned_ascii(practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.emerg])),
    [practical_logger_core_1.LogLevel.alert]: chalk_1.default.bgRed.white.bold(to_aligned_ascii(' ' + practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.alert])),
    [practical_logger_core_1.LogLevel.crit]: chalk_1.default.bgRed.white.bold(to_aligned_ascii(practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.crit])),
    [practical_logger_core_1.LogLevel.error]: chalk_1.default.red.bold(to_aligned_ascii(practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.error])),
    [practical_logger_core_1.LogLevel.warning]: chalk_1.default.yellow.bold(to_aligned_ascii(practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.warning])),
    [practical_logger_core_1.LogLevel.warn]: chalk_1.default.yellow.bold(to_aligned_ascii(practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.warn])),
    [practical_logger_core_1.LogLevel.notice]: chalk_1.default.blue(to_aligned_ascii(practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.notice])),
    [practical_logger_core_1.LogLevel.info]: chalk_1.default.blue(to_aligned_ascii(practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.info])),
    [practical_logger_core_1.LogLevel.verbose]: to_aligned_ascii(practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.verbose]),
    [practical_logger_core_1.LogLevel.log]: to_aligned_ascii(practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.log]),
    [practical_logger_core_1.LogLevel.debug]: to_aligned_ascii(practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.debug]),
    [practical_logger_core_1.LogLevel.trace]: chalk_1.default.dim(to_aligned_ascii(practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.trace])),
    [practical_logger_core_1.LogLevel.silly]: chalk_1.default.dim(to_aligned_ascii(practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.silly])),
};
const LEVEL_TO_STYLIZE = {
    [practical_logger_core_1.LogLevel.fatal]: s => chalk_1.default.red.bold(s),
    [practical_logger_core_1.LogLevel.emerg]: s => chalk_1.default.red.bold(s),
    [practical_logger_core_1.LogLevel.alert]: s => chalk_1.default.red.bold(s),
    [practical_logger_core_1.LogLevel.crit]: s => chalk_1.default.red.bold(s),
    [practical_logger_core_1.LogLevel.error]: s => chalk_1.default.red.bold(s),
    [practical_logger_core_1.LogLevel.warning]: s => chalk_1.default.yellow(s),
    [practical_logger_core_1.LogLevel.warn]: s => chalk_1.default.yellow(s),
    [practical_logger_core_1.LogLevel.notice]: s => chalk_1.default.blue(s),
    [practical_logger_core_1.LogLevel.info]: s => chalk_1.default.blue(s),
    [practical_logger_core_1.LogLevel.verbose]: s => s,
    [practical_logger_core_1.LogLevel.log]: s => s,
    [practical_logger_core_1.LogLevel.debug]: s => s,
    [practical_logger_core_1.LogLevel.trace]: s => chalk_1.default.dim(s),
    [practical_logger_core_1.LogLevel.silly]: s => chalk_1.default.dim(s),
};
exports.LEVEL_TO_STYLIZE = LEVEL_TO_STYLIZE;
function createLogger(p) {
    function outputFn(payload) {
        const { level, name, msg, time, details } = payload;
        const { err } = details, detailsNoErr = tslib_1.__rest(details, ["err"]);
        let line = ''
            + chalk_1.default.dim(time)
            + ' '
            + LEVEL_TO_ASCII[level]
            + '› '
            + LEVEL_TO_STYLIZE[level](''
                + name
                + '›'
                + (msg ? ' ' : '')
                + msg
                + ' '
                + prettifyJson(detailsNoErr));
        console.log(line); // eslint-disable-line no-console
        if (err)
            print_error_to_ansi_1.displayError(err);
    }
    return practical_logger_core_1.createLogger(Object.assign({}, p, { outputFn }));
}
exports.createLogger = createLogger;
//# sourceMappingURL=index.js.map