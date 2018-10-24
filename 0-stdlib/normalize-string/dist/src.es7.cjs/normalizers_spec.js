"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
describe('normalize-string - built-in normalizers', function () {
    const TEST_CASES = {
        capitalize: {
            '': '',
            ' ': ' ',
            'a': 'A',
            ' a': ' a',
            'foo': 'Foo',
            'FoO': 'FoO',
        },
        to_lower_case: {
            '': '',
            ' ': ' ',
            'a': 'a',
            ' A': ' a',
            'ÉTANG': 'étang',
            'FoO': 'foo',
        },
        to_upper_case: {
            '': '',
            ' ': ' ',
            'a': 'A',
            ' A': ' A',
            'étang': 'ÉTANG',
            'FoO': 'FOO',
        },
        trim: {
            '': '',
            ' ': '',
            'a': 'a',
            ' a': 'a',
            ' 	a 	': 'a',
        },
        normalize_unicode: {
            '': '',
            ' ': ' ',
            'a': 'a',
            // TODO real cases!
            'Côte et Ciel': 'Côte et Ciel',
        },
        coerce_to_ascii: {
            '': '',
            ' ': ' ',
            'a': 'a',
            'Côte et Ciel': 'Cote et Ciel',
        },
        coerce_blanks_to_single_spaces: {
            '': '',
            ' ': ' ',
            '	': ' ',
            'a': 'a',
            '	 		': ' ',
            'foo bar': 'foo bar',
            'foo	 bar': 'foo bar',
            'Lord	Mok': 'Lord Mok'
        },
        coerce_delimiters_to_space: {
            '': '',
            ' ': ' ',
            '-': ' ',
            'a': 'a',
            '-+-?': '    ',
            'foo-bar': 'foo bar',
            '++foo/bar++': '  foo bar  ',
            'Lord_Mok': 'Lord Mok'
        },
        convert_spaces_to_camel_case: {
            '': '',
            ' ': '',
            'a': 'A',
            'Côte et Ciel': 'CôteEtCiel',
            'lord Mok': 'LordMok',
        },
        coerce_to_safe_nickname: {
            '': '',
            ' ': '',
            'a': 'A',
            'Côte et Ciel': 'CoteEtCiel',
            ' lord  MOK ': 'LordMok',
            '**lord_MOK** ': 'LordMok',
        },
        coerce_to_redeemable_code: {
            '': '',
            ' ': '',
            'a': 'A',
            'bored ': 'BORED',
            'ALPH-Art': 'ALPHART',
        }
    };
    Object.keys(TEST_CASES).forEach(key => {
        const normalizer = _1.NORMALIZERS[key];
        if (!normalizer)
            throw new Error(`Wrong test case for unknown normalizer "${key}"!`);
        describe(`normalizer "${key}"`, function () {
            const NORMALIZER_TEST_CASES = TEST_CASES[key];
            Object.keys(NORMALIZER_TEST_CASES).forEach(input => {
                const expected_output = NORMALIZER_TEST_CASES[input];
                it(`should correctly normalize "${input}" to "${expected_output}"`, () => {
                    chai_1.expect(normalizer(input)).to.equal(expected_output);
                });
            });
        });
    });
    Object.keys(_1.NORMALIZERS).forEach(key => {
        if (!TEST_CASES[key])
            throw new Error(`Missing test cases for normalizer "${key}"!`);
    });
});
//# sourceMappingURL=normalizers_spec.js.map