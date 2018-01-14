"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("@oh-my-rpg/definitions");
const consts_1 = require("./consts");
function get_SEC(SEC) {
    return definitions_1.oh_my_rpg_get_SEC({
        module: consts_1.LIB_ID,
        parent_SEC: SEC,
    });
    // TODO add details: schema version
}
exports.get_SEC = get_SEC;
//# sourceMappingURL=sec.js.map