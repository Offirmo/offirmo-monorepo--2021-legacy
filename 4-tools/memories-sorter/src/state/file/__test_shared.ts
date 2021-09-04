const { deepStrictEqual: assert_deepStrictEqual } = require('assert').strict

import { normalizeError } from '@offirmo/error-utils'
import { Immutable } from '@offirmo-private/ts-types'
import { get_json_difference } from '@offirmo-private/state-utils'

import '../../__test_shared/mocha_spec'
import { State } from './types'


export function expectㆍfileㆍstatesㆍdeepㆍequal(s1: Immutable<State>, s2: Immutable<State>, should_log = true): void {
	const s1_alt = {
		...s1,
		//memoized: null
	}
	const s2_alt = {
		...s2,
		//memoized: null
	}

	try {
		assert_deepStrictEqual(s1_alt, s2_alt)
	}
	catch (err) {
		if (should_log)
			console.error('expectㆍfileㆍstatesㆍdeepㆍequal() FALSE', get_json_difference(s1_alt, s2_alt))
		throw err
	}
}

export function expectㆍfileㆍstatesㆍNOTㆍdeepㆍequal(s1: Immutable<State>, s2: Immutable<State>): void {
	try {
		expectㆍfileㆍstatesㆍdeepㆍequal(s1, s2, false)
	}
	catch (_err) {
		const err = normalizeError(_err)
		if (err.message.includes('Expected values to be strictly deep-equal'))
			return

		throw err
	}
}
