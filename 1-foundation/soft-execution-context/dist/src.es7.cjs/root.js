"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("./core");
/////////////////////
let root_SEC = null;
function getRootSEC() {
    if (!root_SEC) {
        root_SEC = core_1.createSEC();
        // TODO init plugins!!
    }
    return root_SEC;
}
exports.getRootSEC = getRootSEC;
//# sourceMappingURL=root.js.map