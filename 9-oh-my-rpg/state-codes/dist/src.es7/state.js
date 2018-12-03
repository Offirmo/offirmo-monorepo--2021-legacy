/////////////////////
import { get_human_readable_UTC_timestamp_minutes } from '@offirmo/timestamps';
import { SCHEMA_VERSION } from './consts';
import { is_code_redeemable } from './selectors';
import { get_lib_SEC } from './sec';
/////////////////////
function create(SEC) {
    return get_lib_SEC(SEC).xTry('create', ({ enforce_immutability }) => {
        return enforce_immutability({
            schema_version: SCHEMA_VERSION,
            revision: 0,
            redeemed_codes: {},
        });
    });
}
/////////////////////
function attempt_to_redeem_code(state, code_spec, infos) {
    return get_lib_SEC().xTry('redeem_code', ({ enforce_immutability }) => {
        if (!is_code_redeemable(state, code_spec, infos))
            throw new Error(`This code is either non-existing or non redeemable at the moment!`);
        const code = code_spec.code;
        const r = state.redeemed_codes[code] || {
            redeem_count: 0,
            last_redeem_date_minutes: '',
        };
        return enforce_immutability(Object.assign({}, state, { redeemed_codes: Object.assign({}, state.redeemed_codes, { [code]: Object.assign({}, r, { redeem_count: r.redeem_count + 1, last_redeem_date_minutes: get_human_readable_UTC_timestamp_minutes() }) }), revision: state.revision + 1 }));
    });
}
/////////////////////
export { create, attempt_to_redeem_code, };
/////////////////////
//# sourceMappingURL=state.js.map