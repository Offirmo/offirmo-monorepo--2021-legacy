"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const emittery_1 = tslib_1.__importDefault(require("emittery"));
/////////////////////
const ROOT_PROTOTYPE = Object.create(null);
exports.ROOT_PROTOTYPE = ROOT_PROTOTYPE;
// global bus shared by all SECs
ROOT_PROTOTYPE.emitter = new emittery_1.default();
// common functions
// because we often set the same details
ROOT_PROTOTYPE.setAnalyticsAndErrorDetails = function setAnalyticsAndErrorDetails(details = {}) {
    const SEC = this;
    return SEC
        .setAnalyticsDetails(details)
        .setErrorReportDetails(details);
};
//# sourceMappingURL=root-prototype.js.map