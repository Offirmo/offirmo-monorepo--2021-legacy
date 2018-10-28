import { CODES_BY_KEY } from './data';
import normalize_code from './normalize-code';
/////////////////////
function is_code(code) {
    if (typeof code !== 'string')
        return false;
    code = normalize_code(code);
    if (!CODES_BY_KEY[code])
        return false;
    return true;
}
function is_code_redeemable(state, code, infos) {
    if (!is_code(code))
        return false;
    code = normalize_code(code);
    const code_spec = CODES_BY_KEY[code];
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
/////////////////////
export { normalize_code, is_code, is_code_redeemable, };
//# sourceMappingURL=selectors.js.map