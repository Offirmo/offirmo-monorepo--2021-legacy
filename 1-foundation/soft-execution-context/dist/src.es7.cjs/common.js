"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* global NODE_ENV */
const timestamps_1 = require("@offirmo/timestamps");
function decorateWithDetectedEnv(SEC) {
    let ENV = () => {
        try {
            if (typeof NODE_ENV === 'string')
                return NODE_ENV;
            if (typeof process !== 'undefined' && typeof process.env.NODE_ENV === 'string')
                return process.env.NODE_ENV;
        }
        catch (err) {
            /* swallow */
        }
        return 'development';
    };
    const IS_DEV_MODE = false;
    const IS_VERBOSE = false;
    const CHANNEL = 'unknown';
    const SESSION_START_TIME = timestamps_1.get_UTC_timestamp_ms();
    SEC.injectDependencies({
        ENV,
        'NODE_ENV': ENV,
        IS_DEV_MODE,
        IS_VERBOSE,
        CHANNEL,
        SESSION_START_TIME,
    });
    SEC.setAnalyticsAndErrorDetails({
        ENV,
        CHANNEL,
    });
}
exports.decorateWithDetectedEnv = decorateWithDetectedEnv;
//# sourceMappingURL=common.js.map