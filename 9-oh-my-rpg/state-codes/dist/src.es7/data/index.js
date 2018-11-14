import { get_human_readable_UTC_timestamp_minutes } from '@offirmo/timestamps';
import normalize_code from '../normalize-code';
////////////
// for test only
const TEST_CODES = {
    TESTNEVER: {
        redeem_limit: null,
        is_redeemable: (state, infos) => {
            return false;
        },
    },
    TESTALWAYS: {
        redeem_limit: null,
        is_redeemable: (state, infos) => {
            return true;
        },
    },
    TESTONCE: {
        redeem_limit: 1,
        is_redeemable: (state, infos) => {
            return true;
        },
    },
    TESTTWICE: {
        redeem_limit: 2,
        is_redeemable: (state, infos) => {
            return true;
        },
    },
    TESTNOTIFS: {
        redeem_limit: null,
        is_redeemable: (state, infos) => {
            return true;
        },
    },
    TESTACH: {
        redeem_limit: null,
        is_redeemable: () => true,
    },
};
const RAW_CODES = Object.assign({ BORED: {
        redeem_limit: null,
        is_redeemable: (state, infos) => {
            if (!infos.has_energy_depleted)
                return false;
            if (!state.redeemed_codes['BORED'])
                return true;
            const now_minutes = get_human_readable_UTC_timestamp_minutes();
            const last_redeem_date_minutes = state.redeemed_codes['BORED'].last_redeem_date_minutes;
            const is_same_day = now_minutes.slice(0, 8) === last_redeem_date_minutes.slice(0, 8);
            return !is_same_day;
        },
    }, REBORN: {
        redeem_limit: 1,
        is_redeemable: (state, infos) => {
            return infos.is_alpha_player;
        }
    }, ALPHART: {
        redeem_limit: 1,
        is_redeemable: (state, infos) => {
            return infos.is_alpha_player && infos.good_play_count < 20;
        }
    } }, TEST_CODES);
////////////
const ALL_CODES = Object.keys(RAW_CODES).map(hkey => {
    const { key, code, redeem_limit, is_redeemable, } = RAW_CODES[hkey];
    if (key)
        throw new Error(`Code entry "${hkey}" redundantly specifies a key!`);
    if (hkey !== normalize_code(hkey))
        throw new Error(`Code entry "${hkey}" should have normalized form "${normalize_code(hkey)}"!`);
    return {
        key: hkey,
        code: code || hkey,
        redeem_limit,
        is_redeemable,
    };
});
const CODES_BY_KEY = ALL_CODES.reduce((acc, code) => {
    acc[code.key] = code;
    return acc;
}, {});
////////////
export { CODES_BY_KEY, ALL_CODES };
//# sourceMappingURL=index.js.map