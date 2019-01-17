import {
	CodeSpec,
	normalize_code,
	is_code_redeemable as _is_code_redeemable,
} from '@oh-my-rpg/state-codes'

import { State } from '../types'

import { CODE_SPECS_BY_KEY } from '../data/codes'

/////////////////////

// TODO used?
function is_code_redeemable(state: Readonly<State>, code: string): boolean {
	code = normalize_code(code)
	const code_spec = CODE_SPECS_BY_KEY[code]
	if (!code_spec)
		throw new Error(`This code doesn't exist!`)

	return _is_code_redeemable(state.u_state.codes, code_spec, state)
}

/////////////////////

export {
	is_code_redeemable,
}
