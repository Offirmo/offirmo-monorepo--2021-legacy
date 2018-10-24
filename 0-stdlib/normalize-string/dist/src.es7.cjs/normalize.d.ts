import { StringNormalizer } from './types';
declare function combine_normalizers(...normalizers: StringNormalizer[]): StringNormalizer;
declare function normalize(s: string, ...normalizers: StringNormalizer[]): string;
export { combine_normalizers, normalize, };
