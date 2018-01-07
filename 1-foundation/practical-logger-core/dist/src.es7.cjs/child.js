"use strict";
// TODO
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("./core");
function createChildLogger({ parent, name = parent._.name, level = parent.getLevel(), details = {}, outputFn = parent._.outputFn, }) {
    details = Object.assign({}, parent._.details, details);
    return core_1.createLogger({
        name,
        level,
        details,
        outputFn,
    });
}
exports.createChildLogger = createChildLogger;
//# sourceMappingURL=child.js.map