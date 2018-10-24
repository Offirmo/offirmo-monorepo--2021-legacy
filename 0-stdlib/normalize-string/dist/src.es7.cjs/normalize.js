"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function combine_normalizers(...normalizers) {
    return s => normalizers.reduce((acc, normalizer) => {
        const out = normalizer(acc);
        //console.log(`combined normalization: "${acc}" -> "${out}"`)
        return out;
    }, s);
}
exports.combine_normalizers = combine_normalizers;
function normalize(s, ...normalizers) {
    return combine_normalizers(...normalizers)(s);
}
exports.normalize = normalize;
//# sourceMappingURL=normalize.js.map