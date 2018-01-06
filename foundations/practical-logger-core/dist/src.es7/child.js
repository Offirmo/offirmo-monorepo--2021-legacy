// TODO
import { createLogger } from './core';
function createChildLogger({ parent, name = parent._.name, level = parent.getLevel(), details = {}, outputFn = parent._.outputFn, }) {
    details = Object.assign({}, parent._.details, details);
    return createLogger({
        name,
        level,
        details,
        outputFn,
    });
}
export { createChildLogger, };
//# sourceMappingURL=child.js.map