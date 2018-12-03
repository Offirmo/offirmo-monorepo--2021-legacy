import normalize_code from '../normalize-code';
const TEST_CODES = {
    TESTNEVER: {
        redeem_limit: null,
        is_redeemable: () => false,
    },
    TESTALWAYS: {
        redeem_limit: null,
        is_redeemable: () => true,
    },
    TESTONCE: {
        redeem_limit: 1,
        is_redeemable: () => true,
    },
    TESTTWICE: {
        redeem_limit: 2,
        is_redeemable: () => true,
    },
};
const RAW_CODES = Object.assign({}, TEST_CODES);
////////////
const ALL_CODESPECS = Object.keys(RAW_CODES).map(key => {
    const { code, redeem_limit, is_redeemable, } = RAW_CODES[key];
    if (code)
        throw new Error(`Code entry "${key}" redundantly specifies a code!`);
    if (key !== normalize_code(key))
        throw new Error(`Code entry "${key}" should have normalized form "${normalize_code(key)}"!`);
    return {
        code: key,
        redeem_limit,
        is_redeemable,
    };
});
const CODESPECS_BY_KEY = ALL_CODESPECS.reduce((acc, code_spec) => {
    acc[code_spec.code] = code_spec;
    return acc;
}, {});
////////////
export { CODESPECS_BY_KEY, ALL_CODESPECS };
//# sourceMappingURL=index.js.map