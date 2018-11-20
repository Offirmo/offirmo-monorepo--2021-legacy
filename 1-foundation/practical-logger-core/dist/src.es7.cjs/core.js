"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = require("typescript-string-enums");
const timestamps_1 = require("@offirmo/timestamps");
const types_1 = require("./types");
const const_1 = require("./const");
function checkLevel(level) {
    if (!typescript_string_enums_1.Enum.isType(types_1.LogLevel, level))
        throw new Error(`${const_1.LIB}: checkLevel(): Not a valid log level: "${level}"!`);
}
function createLogger({ name, level = types_1.LogLevel.info, details = {}, outputFn = console.log, }) {
    if (!name)
        throw new Error(`${const_1.LIB}.${createLogger.name}(): you must provide a name!`);
    const internalState = {
        name,
        level,
        details: Object.assign({}, details),
        outputFn: outputFn,
    };
    let level_int = 0;
    const logger = const_1.ALL_LOG_LEVELS.reduce((logger, level) => {
        logger[level] = (message, details) => {
            if (!isLevelEnabled(level))
                return;
            if (!details && typeof message === 'object') {
                details = message;
                message = details.err
                    ? details.err.message
                    : '';
            }
            message = message || '';
            outputFn(serializer(level, message, details));
        };
        return logger;
    }, {
        _: internalState,
        isLevelEnabled,
        setLevel,
        getLevel,
        addDetails,
    });
    function setLevel(level) {
        checkLevel(level);
        internalState.level = level;
        level_int = const_1.LEVEL_TO_INTEGER[level];
    }
    setLevel(level);
    function isLevelEnabled(level) {
        checkLevel(level);
        return const_1.LEVEL_TO_INTEGER[level] >= level_int;
    }
    function getLevel() {
        return internalState.level;
    }
    function addDetails(details) {
        internalState.details = Object.assign({}, internalState.details, details);
    }
    // TODO child
    /*
    function child({name, level, details}: Partial<LogParams>): Logger {
        return createChildLogger({
            parent: logger,
            name,
            level,
            details,
        })
    }
    */
    function serializer(level, msg, details) {
        const payload = {
            details: Object.assign({}, internalState.details, details),
            level,
            name,
            time: timestamps_1.get_human_readable_UTC_timestamp_ms_v1(),
            //time: (new Date()).toISOString(),
            msg,
        };
        return payload;
    }
    return logger;
}
exports.createLogger = createLogger;
//# sourceMappingURL=core.js.map