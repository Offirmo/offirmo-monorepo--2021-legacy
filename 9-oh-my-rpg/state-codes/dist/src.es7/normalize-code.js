import { NORMALIZERS } from '@offirmo/normalize-string';
// useless function to circumvent a strange TS bug
function normalize_code(s) {
    return NORMALIZERS.coerce_to_redeemable_code(s);
}
export default normalize_code;
//# sourceMappingURL=normalize-code.js.map