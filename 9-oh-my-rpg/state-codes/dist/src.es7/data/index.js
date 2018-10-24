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
};
const RAW_CODES = Object.assign({ BORED: {
        redeem_limit: null,
        is_redeemable: (state, infos) => {
            return false; // TODO
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