"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("./consts");
/////////////////////
const enforce_immutability = (v) => v;
//const enforce_immutability = (state: State) => deepFreeze(state) TODO
function decorate_SEC(SEC) {
    SEC.injectDependencies({
        enforce_immutability,
    });
    SEC.setAnalyticsAndErrorDetails({
        product: consts_1.PRODUCT,
    });
    return SEC; // for chaining
}
exports.decorate_SEC = decorate_SEC;
//# sourceMappingURL=root_sec.js.map