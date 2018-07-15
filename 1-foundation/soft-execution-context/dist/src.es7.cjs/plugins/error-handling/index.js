"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const normalize_error_1 = require("@offirmo/normalize-error");
const promise_try_1 = require("@offirmo/promise-try");
const timestamps_1 = require("@offirmo/timestamps");
const constants_1 = require("../../constants");
const utils_1 = require("../../utils");
const State = tslib_1.__importStar(require("./state"));
const catch_factory_1 = require("./catch-factory");
const index_1 = require("../dependency-injection/index");
const TopState = tslib_1.__importStar(require("../../state"));
const PLUGIN_ID = 'error_handling';
function cleanTemp(err) {
    delete err._temp;
    return err;
}
const PLUGIN = {
    id: PLUGIN_ID,
    state: State,
    augment: prototype => {
        prototype._handleError = function handleError({ SEC, debugId = '?', shouldRethrow = true }, err) {
            catch_factory_1.createCatcher({
                debugId,
                decorators: [
                    normalize_error_1.normalizeError,
                    err => SEC._decorateErrorWithLogicalStack(err),
                    err => SEC._decorateErrorWithDetails(err),
                ],
                onError: shouldRethrow
                    ? null
                    : err => SEC.emitter.emit('final-error', { SEC, err: cleanTemp(err) }),
            })(err);
        };
        prototype.throwNewError = function throwNewError(message, details) {
            const SEC = this;
            const err = new Error(message);
            err.details = details;
            SEC._handleError({
                SEC,
                shouldRethrow: true,
            });
        };
        prototype._decorateErrorWithDetails = function _decorateErrorWithDetails(err) {
            const SEC = this;
            const state = SEC[constants_1.INTERNAL_PROP];
            const now = timestamps_1.get_UTC_timestamp_ms();
            const autoDetails = {
                ENV: state.plugins[index_1.PLUGIN_ID].context.ENV,
                TIME: now,
                SESSION_DURATION_MS: now - state.plugins[index_1.PLUGIN_ID].context.SESSION_START_TIME,
            };
            const userDetails = utils_1.flattenToOwn(state.plugins[PLUGIN_ID].details);
            err.details = Object.assign({}, autoDetails, userDetails, (err.details || {}));
            return err;
        };
        prototype.setErrorReportDetails = function setErrorReportDetails(details) {
            const SEC = this;
            let root_state = SEC[constants_1.INTERNAL_PROP];
            root_state = TopState.reduce_plugin(root_state, PLUGIN_ID, plugin_state => {
                Object.entries(details).forEach(([key, value]) => {
                    plugin_state = State.addDetail(plugin_state, key, value);
                });
                return plugin_state;
            });
            this[constants_1.INTERNAL_PROP] = root_state;
            return SEC; // for chaining
        };
        prototype.xTry = function xTry(operation, fn) {
            const SEC = this
                .createChild()
                .setLogicalStack({ operation });
            const params = SEC[constants_1.INTERNAL_PROP].plugins[index_1.PLUGIN_ID].context;
            try {
                return fn(params);
            }
            catch (err) {
                SEC._handleError({
                    SEC,
                    debugId: 'xTry',
                    shouldRethrow: true,
                }, err);
            }
        };
        prototype.xTryCatch = function xTryCatch(operation, fn) {
            const SEC = this
                .createChild()
                .setLogicalStack({ operation });
            const params = SEC[constants_1.INTERNAL_PROP].plugins[index_1.PLUGIN_ID].context;
            try {
                return fn(params);
            }
            catch (err) {
                SEC._handleError({
                    SEC,
                    debugId: 'xTryCatch',
                    shouldRethrow: false,
                }, err);
            }
        };
        prototype.xPromiseCatch = function xPromiseCatch(operation, promise) {
            const SEC = this
                .createChild()
                .setLogicalStack({ operation });
            return promise
                .catch(err => {
                SEC._handleError({
                    SEC,
                    debugId: 'xPromiseCatch',
                    shouldRethrow: false,
                }, err);
            });
        };
        prototype.xPromiseTry = function xPromiseTry(operation, fn) {
            const SEC = this
                .createChild()
                .setLogicalStack({ operation });
            const params = SEC[constants_1.INTERNAL_PROP].plugins[index_1.PLUGIN_ID].context;
            return promise_try_1.promiseTry(() => fn(params))
                .catch(err => {
                SEC._handleError({
                    SEC,
                    debugId: 'xPromiseTry',
                    shouldRethrow: true,
                }, err);
            });
        };
        prototype.xPromiseTryCatch = function xPromiseTryCatch(operation, fn) {
            const SEC = this
                .createChild()
                .setLogicalStack({ operation });
            const params = SEC[constants_1.INTERNAL_PROP].plugins[index_1.PLUGIN_ID].context;
            return promise_try_1.promiseTry(() => fn(params))
                .catch(err => {
                SEC._handleError({
                    SEC,
                    debugId: 'xPromiseTryCatch',
                    shouldRethrow: false,
                }, err);
            });
        };
    }
};
exports.PLUGIN = PLUGIN;
//# sourceMappingURL=index.js.map