import { StringNormalizer } from './types'


function combine_normalizers(...normalizers: StringNormalizer[]): StringNormalizer {
	return s => normalizers.reduce((acc: string, normalizer: StringNormalizer): string => {
		const out = normalizer(acc)
		//console.log(`combined normalization: "${acc}" -> "${out}"`)
		return out
	}, s)
}

function normalize(s: string, ...normalizers: StringNormalizer[]): string {
	return combine_normalizers(...normalizers)(s)
}

export {
	combine_normalizers,
	normalize,
}
