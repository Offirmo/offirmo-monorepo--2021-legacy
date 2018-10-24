"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const data_1 = require("./data");
const normalize_code_1 = tslib_1.__importDefault(require("./normalize-code"));
/////////////////////
function is_code(code) {
    if (typeof code !== 'string')
        return false;
    code = normalize_code_1.default(code);
    if (!data_1.CODES_BY_KEY[code])
        return false;
    return true;
}
exports.is_code = is_code;
function is_code_redeemable(state, code, infos) {
    if (!is_code(code))
        return false;
    code = normalize_code_1.default(code);
    const code_spec = data_1.CODES_BY_KEY[code];
    const code_redemption = state.redeemed_codes[code];
    // integrated conditions
    if (code_redemption && code_spec.redeem_limit) {
        const redeem_limit = code_spec.redeem_limit;
        if (code_redemption.redeem_count >= redeem_limit)
            return false;
    }
    // custom condition
    if (!code_spec.is_redeemable(state, infos))
        return false;
    return true;
}
exports.is_code_redeemable = is_code_redeemable;
//# sourceMappingURL=selectors.js.map