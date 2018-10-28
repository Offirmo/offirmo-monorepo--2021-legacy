"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const normalize_string_1 = require("@offirmo/normalize-string");
// useless function to circumvent a strange TS bug
function normalize_code(s) {
    return normalize_string_1.NORMALIZERS.coerce_to_redeemable_code(s);
}
exports.default = normalize_code;
//# sourceMappingURL=normalize-code.js.map