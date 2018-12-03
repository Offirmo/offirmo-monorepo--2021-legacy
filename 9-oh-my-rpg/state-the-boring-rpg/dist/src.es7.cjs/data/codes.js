"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timestamps_1 = require("@offirmo/timestamps");
const state_codes_1 = require("@oh-my-rpg/state-codes");
const selectors_1 = require("../selectors");
////////////
// TODO move data outside!
// for test only
const TEST_CODES = {
    TESTNOTIFS: {
        redeem_limit: null,
        is_redeemable: () => true,
    },
    TESTACH: {
        redeem_limit: null,
        is_redeemable: () => true,
    },
    REBORNX: {
        redeem_limit: null,
        is_redeemable: () => selectors_1.is_alpha(),
    },
};
const ALPHA_CODES = {
    REBORN: {
        redeem_limit: null,
        is_redeemable: () => selectors_1.is_alpha(),
    },
    ALPHATWINK: {
        redeem_limit: 1,
        is_redeemable: () => selectors_1.is_alpha(),
    },
};
const POWER_CODES = {
    BORED: {
        redeem_limit: null,
        is_redeemable: (state, progress_state) => {
            const has_energy_depleted = selectors_1.get_energy_snapshot(state).available_energy < 1;
            if (!has_energy_depleted)
                return false;
            if (!progress_state.redeemed_codes['BORED'])
                return true;
            const now_minutes = timestamps_1.get_human_readable_UTC_timestamp_minutes();
            const last_redeem_date_minutes = progress_state.redeemed_codes['BORED'].last_redeem_date_minutes;
            const is_same_day = now_minutes.slice(0, 8) === last_redeem_date_minutes.slice(0, 8);
            return !is_same_day;
        },
    },
    // https://en.wikipedia.org/wiki/Colossal_Cave_Adventure
    XYZZY: {
        redeem_limit: null,
        is_redeemable: () => true,
    },
    PLUGH: {
        redeem_limit: null,
        is_redeemable: () => true,
    },
};
const RAW_CODES = Object.assign({}, TEST_CODES, ALPHA_CODES, POWER_CODES);
////////////
const ALL_CODESPECS = Object.keys(RAW_CODES).map(key => {
    const { code, redeem_limit, is_redeemable, } = RAW_CODES[key];
    if (code)
        throw new Error(`Code entry "${key}" redundantly specifies a code!`);
    if (key !== state_codes_1.normalize_code(key))
        throw new Error(`Code entry "${key}" should have normalized form "${state_codes_1.normalize_code(key)}"!`);
    return {
        code: key,
        redeem_limit,
        is_redeemable,
    };
});
const CODE_SPECS_BY_KEY = ALL_CODESPECS.reduce((acc, code_spec) => {
    acc[code_spec.code] = code_spec;
    return acc;
}, {});
exports.CODE_SPECS_BY_KEY = CODE_SPECS_BY_KEY;
//# sourceMappingURL=codes.js.map