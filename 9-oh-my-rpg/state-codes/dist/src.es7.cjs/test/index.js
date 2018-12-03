"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const normalize_code_1 = tslib_1.__importDefault(require("../normalize-code"));
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
    if (key !== normalize_code_1.default(key))
        throw new Error(`Code entry "${key}" should have normalized form "${normalize_code_1.default(key)}"!`);
    return {
        code: key,
        redeem_limit,
        is_redeemable,
    };
});
exports.ALL_CODESPECS = ALL_CODESPECS;
const CODESPECS_BY_KEY = ALL_CODESPECS.reduce((acc, code_spec) => {
    acc[code_spec.code] = code_spec;
    return acc;
}, {});
exports.CODESPECS_BY_KEY = CODESPECS_BY_KEY;
//# sourceMappingURL=index.js.map