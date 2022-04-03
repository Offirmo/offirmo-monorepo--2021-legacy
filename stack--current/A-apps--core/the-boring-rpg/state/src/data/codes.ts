import { Immutable} from '@offirmo-private/ts-types'
import { get_human_readable_UTC_timestamp_minutes } from '@offirmo-private/timestamps'

import { CodeSpec, normalize_code, State as ProgressState } from '@oh-my-rpg/state-codes'

import { State } from '../types'
import {
	is_alpha,
	is_registered_alpha_player,
	get_available_energy_float,
} from '../selectors'

////////////

// TODO move data outside?

// for test only
const TEST_CODES: Immutable<{ [key: string]: Immutable<Partial<CodeSpec<State>>> }> = {

	TESTNOTIFS: {
		redeem_limit: null,
		is_redeemable: () => true,
	},

	TESTACH: {
		redeem_limit: null,
		is_redeemable: () => true,
	},

	REBORNX: {
		redeem_limit: null,
		is_redeemable: () => is_alpha(),
	},

	// see also DEV and NODEV in the-boring-rpg/client--browser/src/components/panels/meta/component.jsx
}

const ALPHA_CODES: Immutable<{ [key: string]: Immutable<Partial<CodeSpec<State>>> }> = {

	REBORN: {
		redeem_limit: null,
		is_redeemable: () => is_alpha(),
	},

	ALPHATWINK: {
		redeem_limit: 1,
		is_redeemable: () => is_alpha(),
	},

}

const POWER_CODES: Immutable<{ [key: string]: Immutable<Partial<CodeSpec<State>>> }> = {

	BORED: {
		redeem_limit: null,
		is_redeemable: (state: Immutable<State>, progress_state: Immutable<ProgressState>) => {
			const has_energy_depleted = get_available_energy_float(state.t_state) < 1.
			if (!has_energy_depleted)
				return false

			if (!progress_state.redeemed_codes['BORED'])
				return true

			const now_minutes = get_human_readable_UTC_timestamp_minutes()
			const last_redeem_date_minutes = progress_state.redeemed_codes['BORED']!.last_redeem_date_minutes
			const is_same_day = now_minutes.slice(0, 8) === last_redeem_date_minutes.slice(0, 8)
			return !is_same_day
		},
	},

	// https://en.wikipedia.org/wiki/Colossal_Cave_Adventure
	XYZZY: {
		redeem_limit: null,
		is_redeemable: () => true,
	},
	PLUGH: {
		redeem_limit: null,
		is_redeemable: () => true,
	},
}

const RAW_CODES: Immutable<{ [key: string]: Immutable<Partial<CodeSpec<State>>> }> = {
	...TEST_CODES,
	...ALPHA_CODES,
	...POWER_CODES,
}

////////////

const ALL_CODESPECS: Immutable<CodeSpec<State>>[] = Object.keys(RAW_CODES).map(key => {
	const {
		code,
		redeem_limit,
		is_redeemable,
	} = RAW_CODES[key]

	if (code)
		throw new Error(`Code entry "${key}" redundantly specifies a code!`)
	if (key !== normalize_code(key))
		throw new Error(`Code entry "${key}" should have normalized form "${normalize_code(key)}"!`)

	return {
		code: key,
		redeem_limit,
		is_redeemable,
	} as CodeSpec<State>
})

const CODE_SPECS_BY_KEY: { [key: string]: Immutable<CodeSpec<State>> } = ALL_CODESPECS.reduce(
	(acc, code_spec) => {
		acc[code_spec.code] = code_spec
		return acc
	},
	{} as { [key: string]: Immutable<CodeSpec<State>> },
)

////////////

export {
	CODE_SPECS_BY_KEY,
}
