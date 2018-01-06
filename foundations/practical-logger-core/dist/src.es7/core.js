import { Enum } from 'typescript-string-enums';
import { get_human_readable_UTC_timestamp_ms_v1 } from '@offirmo/timestamps';
import { LogLevel, } from './types';
import { ALL_LOG_LEVELS, LEVEL_TO_INTEGER, } from './const';
function checkLevel(level) {
    if (!Enum.isType(LogLevel, level))
        throw new Error(`Not a valid log level: "${level}"!`);
}
function createLogger({ name, level = LogLevel.info, details = {}, outputFn = console.log, }) {
    if (!name)
        throw new Error('universal-logger-core›create(): you must provide a name!');
    const internalState = {
        name,
        level,
        details: Object.assign({}, details),
        outputFn: outputFn,
    };
    let level_int = 0;
    const logger = ALL_LOG_LEVELS.reduce((logger, level) => {
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
        level_int = LEVEL_TO_INTEGER[level];
    }
    setLevel(level);
    function isLevelEnabled(level) {
        checkLevel(level);
        return LEVEL_TO_INTEGER[level] >= level_int;
    }
    function getLevel() {
        return internalState.level;
    }
    function addDetails(details) {
        internalState.details = Object.assign({}, internalState.details, details);
    }
    // TODO check
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
            time: get_human_readable_UTC_timestamp_ms_v1(),
            //time: (new Date()).toISOString(),
            msg,
        };
        return payload;
    }
    return logger;
}
export { createLogger, };
//# sourceMappingURL=core.js.map