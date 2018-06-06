"use strict";
/////////////////////
// TODO move to SEC lib when turned to TS
Object.defineProperty(exports, "__esModule", { value: true });
/////////////////////
const enforce_immutability = (v) => v;
//const enforce_immutability = (state: State) => deepFreeze(state) TODO
function enrich_SEC(SEC) {
    SEC.injectDependencies({
        enforce_immutability,
    });
    // TODO add debug details, version, etc.
}
exports.enrich_SEC = enrich_SEC;
//# sourceMappingURL=root_sec.js.map