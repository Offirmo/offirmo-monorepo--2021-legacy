"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_codes_1 = require("@oh-my-rpg/state-codes");
const codes_1 = require("../data/codes");
/////////////////////
function is_code_redeemable(state, code) {
    code = state_codes_1.normalize_code(code);
    const code_spec = codes_1.CODE_SPECS_BY_KEY[code];
    if (!code_spec)
        throw new Error(`This code doesn't exist!`);
    return state_codes_1.is_code_redeemable(state.codes, code_spec, state);
}
exports.is_code_redeemable = is_code_redeemable;
//# sourceMappingURL=codes.js.map