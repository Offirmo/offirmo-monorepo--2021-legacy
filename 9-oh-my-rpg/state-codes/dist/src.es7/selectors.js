import { LIB } from './consts';
import normalize_code from './normalize-code';
/////////////////////
function is_code(code) {
    if (typeof code !== 'string')
        return false;
    code = normalize_code(code);
    if (!code)
        return false;
    return true;
}
function is_code_redeemable(state, code_spec, infos) {
    if (!code_spec)
        throw new Error(`${LIB}: is_code_redeemable() invalid invocation!`);
    const code = normalize_code(code_spec.code);
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
/////////////////////
export { normalize_code, is_code, is_code_redeemable, };
//# sourceMappingURL=selectors.js.map