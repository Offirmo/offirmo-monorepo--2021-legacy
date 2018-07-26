"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const timestamps_1 = require("@offirmo/timestamps");
const constants_1 = require("../../constants");
const TopState = tslib_1.__importStar(require("../../state"));
const utils_1 = require("../../utils");
const State = tslib_1.__importStar(require("./state"));
const dependency_injection_1 = require("../dependency-injection");
const PLUGIN_ID = 'analytics';
exports.PLUGIN_ID = PLUGIN_ID;
const PLUGIN = {
    id: PLUGIN_ID,
    state: State,
    augment: prototype => {
        prototype.setAnalyticsDetails = function setAnalyticsDetails(details) {
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
        prototype.fireAnalyticsEvent = function fireAnalyticsEvent(eventId, details = {}) {
            const SEC = this;
            const now = timestamps_1.get_UTC_timestamp_ms();
            let root_state = SEC[constants_1.INTERNAL_PROP];
            if (!eventId)
                throw new Error('Incorrect eventId!');
            const { ENV } = SEC.getInjectedDependencies();
            const autoDetails = {
                ENV,
                TIME: now,
                SESSION_DURATION_MS: now - root_state.plugins[dependency_injection_1.PLUGIN_ID].context.SESSION_START_TIME,
            };
            const userDetails = SEC.getAnalyticsDetails();
            details = Object.assign({}, autoDetails, userDetails, details);
            SEC.emitter.emit('analytics', { SEC, eventId, details });
            return SEC; // for chaining
        };
        prototype.getAnalyticsDetails = function getAnalyticsDetails() {
            const SEC = this;
            const plugin_state = SEC[constants_1.INTERNAL_PROP].plugins[PLUGIN_ID];
            return utils_1.flattenToOwn(plugin_state.details);
        };
    }
};
exports.PLUGIN = PLUGIN;
//# sourceMappingURL=index.js.map