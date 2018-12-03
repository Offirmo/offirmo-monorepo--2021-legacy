"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const consts_1 = require("./consts");
const normalize_code_1 = tslib_1.__importDefault(require("./normalize-code"));
exports.normalize_code = normalize_code_1.default;
/////////////////////
function is_code(code) {
    if (typeof code !== 'string')
        return false;
    code = normalize_code_1.default(code);
    if (!code)
        return false;
    return true;
}
exports.is_code = is_code;
function is_code_redeemable(state, code_spec, infos) {
    if (!code_spec)
        throw new Error(`${consts_1.LIB}: is_code_redeemable() invalid invocation!`);
    const code = normalize_code_1.default(code_spec.code);
    if (code_spec.code !== code)
        throw new Error(`Invalid code spec for "${code_spec.code}", should be "${code}"!`);
    const code_redemption = state.redeemed_codes[code];
    // integrated conditions
    if (code_redemption && code_spec.redeem_limit) {
        const redeem_limit = code_spec.redeem_limit;
        if (code_redemption.redeem_count >= redeem_limit)
            return false;
    }
    // custom condition
    if (!code_spec.is_redeemable(infos, state))
        return false;
    return true;
}
exports.is_code_redeemable = is_code_redeemable;
//# sourceMappingURL=selectors.js.map