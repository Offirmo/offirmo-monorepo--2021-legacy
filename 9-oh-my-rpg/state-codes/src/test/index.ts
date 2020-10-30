import { Immutable, enforce_immutability } from '@offirmo-private/state-utils'

import normalize_code from '../normalize-code'
import { CodeSpec, State } from '../types'

////////////
// for test only

interface CodesConditions {
	has_energy_depleted: boolean
	good_play_count: number
	is_alpha_player: boolean
	is_player_since_alpha: boolean
}

const TEST_CODES = enforce_immutability<{ [key: string]: Partial<CodeSpec<CodesConditions>> }>({

	TESTNEVER: {
		redeem_limit: null,
		is_redeemable: () => false,
	},

	TESTALWAYS: {
		redeem_limit: null,
		is_redeemable: () => true,
	},

	TESTONCE: {
		redeem_limit: 1,
		is_redeemable: () => true,
	},

	TESTTWICE: {
		redeem_limit: 2,
		is_redeemable: () => true,
	},
})

const RAW_CODES = enforce_immutability<{ [key: string]: Partial<CodeSpec<CodesConditions>> }>({
	...TEST_CODES,
})

////////////

const ALL_CODESPECS: Immutable<CodeSpec<CodesConditions>>[] = Object.keys(RAW_CODES).map(key => {
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
	} as CodeSpec<CodesConditions>
})

const CODESPECS_BY_KEY: Immutable<{ [key: string]: CodeSpec<CodesConditions> }> = ALL_CODESPECS.reduce(
	(acc, code_spec) => {
		acc[code_spec.code] = code_spec
		return acc
	},
	{} as { [key: string]: CodeSpec<CodesConditions> },
)

////////////

export {
	CodesConditions,
	CODESPECS_BY_KEY,
	ALL_CODESPECS,
}
