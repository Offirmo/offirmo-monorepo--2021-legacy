function combine_normalizers(...normalizers) {
    return s => normalizers.reduce((acc, normalizer) => {
        const out = normalizer(acc);
        //console.log(`combined normalization: "${acc}" -> "${out}"`)
        return out;
    }, s);
}
function normalize(s, ...normalizers) {
    return combine_normalizers(...normalizers)(s);
}
export { combine_normalizers, normalize, };
//# sourceMappingURL=normalize.js.map