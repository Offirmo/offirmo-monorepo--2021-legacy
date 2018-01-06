import * as tslib_1 from "tslib";
import { LEVEL_TO_HUMAN, LogLevel, createLogger as createCoreLogger, createChildLogger, } from '@offirmo/practical-logger-core';
import { displayError } from '@offirmo/print-error-to-ansi';
import chalk from 'chalk';
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
    [LogLevel.fatal]: chalk.bgRed.white.bold(to_aligned_ascii(' ' + LEVEL_TO_HUMAN[LogLevel.fatal])),
    [LogLevel.emerg]: chalk.bgRed.white.bold(to_aligned_ascii(LEVEL_TO_HUMAN[LogLevel.emerg])),
    [LogLevel.alert]: chalk.bgRed.white.bold(to_aligned_ascii(' ' + LEVEL_TO_HUMAN[LogLevel.alert])),
    [LogLevel.crit]: chalk.bgRed.white.bold(to_aligned_ascii(LEVEL_TO_HUMAN[LogLevel.crit])),
    [LogLevel.error]: chalk.red.bold(to_aligned_ascii(LEVEL_TO_HUMAN[LogLevel.error])),
    [LogLevel.warning]: chalk.yellow.bold(to_aligned_ascii(LEVEL_TO_HUMAN[LogLevel.warning])),
    [LogLevel.warn]: chalk.yellow.bold(to_aligned_ascii(LEVEL_TO_HUMAN[LogLevel.warn])),
    [LogLevel.notice]: chalk.blue(to_aligned_ascii(LEVEL_TO_HUMAN[LogLevel.notice])),
    [LogLevel.info]: chalk.blue(to_aligned_ascii(LEVEL_TO_HUMAN[LogLevel.info])),
    [LogLevel.verbose]: to_aligned_ascii(LEVEL_TO_HUMAN[LogLevel.verbose]),
    [LogLevel.log]: to_aligned_ascii(LEVEL_TO_HUMAN[LogLevel.log]),
    [LogLevel.debug]: to_aligned_ascii(LEVEL_TO_HUMAN[LogLevel.debug]),
    [LogLevel.trace]: chalk.dim(to_aligned_ascii(LEVEL_TO_HUMAN[LogLevel.trace])),
    [LogLevel.silly]: chalk.dim(to_aligned_ascii(LEVEL_TO_HUMAN[LogLevel.silly])),
};
const LEVEL_TO_COLORIZE_BODY = {
    [LogLevel.fatal]: s => chalk.red.bold(s),
    [LogLevel.emerg]: s => chalk.red.bold(s),
    [LogLevel.alert]: s => chalk.red.bold(s),
    [LogLevel.crit]: s => chalk.red.bold(s),
    [LogLevel.error]: s => chalk.red.bold(s),
    [LogLevel.warning]: s => chalk.yellow(s),
    [LogLevel.warn]: s => chalk.yellow(s),
    [LogLevel.notice]: s => chalk.blue(s),
    [LogLevel.info]: s => chalk.blue(s),
    [LogLevel.verbose]: s => s,
    [LogLevel.log]: s => s,
    [LogLevel.debug]: s => s,
    [LogLevel.trace]: s => chalk.dim(s),
    [LogLevel.silly]: s => chalk.dim(s),
};
function createLogger(p) {
    function outputFn(payload) {
        const { level, name, msg, time, details } = payload;
        const { err } = details, detailsNoErr = tslib_1.__rest(details, ["err"]);
        let line = ''
            + chalk.dim(time)
            + ' '
            + LEVEL_TO_ASCII[level]
            + '› '
            + LEVEL_TO_COLORIZE_BODY[level](''
                + name
                + '›'
                + (msg ? ' ' : '')
                + msg
                + ' '
                + prettifyJson(detailsNoErr));
        console.log(line);
        if (err)
            displayError(err);
    }
    return createCoreLogger(Object.assign({}, p, { outputFn }));
}
export { createLogger, createChildLogger, };
//# sourceMappingURL=index.js.map