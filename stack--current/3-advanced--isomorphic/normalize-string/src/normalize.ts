import { StringNormalizer } from './types'


export function combine_normalizers(...normalizers: StringNormalizer[]): StringNormalizer {
	return s => normalizers.reduce((acc: string, normalizer: StringNormalizer): string => {
		const out = normalizer(acc)
		//console.log(`combined normalization: "${acc}" -> "${out}"`)
		return out
	}, s)
}

export function normalize(s: string, ...normalizers: StringNormalizer[]): string {
	return combine_normalizers(...normalizers)(s)
}

export function default_to(def = ''): StringNormalizer {
	return (s: string): string => s ? s : ''
}
