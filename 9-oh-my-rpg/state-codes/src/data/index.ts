import normalize_code from '../normalize-code'
import { Code, CodesConditions, State } from '../types'

////////////

// for test only
const TEST_CODES: { [key: string]: Partial<Code> } = {

	TESTNEVER: {
		redeem_limit: null,
		is_redeemable: (state: Readonly<State>, infos: Readonly<CodesConditions>) => {
			return false
		},
	},

	TESTALWAYS: {
		redeem_limit: null,
		is_redeemable: (state: Readonly<State>, infos: Readonly<CodesConditions>) => {
			return true
		},
	},

	TESTONCE: {
		redeem_limit: 1,
		is_redeemable: (state: Readonly<State>, infos: Readonly<CodesConditions>) => {
			return true
		},
	},

	TESTTWICE: {
		redeem_limit: 2,
		is_redeemable: (state: Readonly<State>, infos: Readonly<CodesConditions>) => {
			return true
		},
	},
}

const RAW_CODES: { [key: string]: Partial<Code> } = {

	BORED: {
		redeem_limit: null,
		is_redeemable: (state: Readonly<State>, infos: Readonly<CodesConditions>) => {
			return false // TODO
		},
	},

	REBORN: {
		redeem_limit: 1,
		is_redeemable: (state: Readonly<State>, infos: Readonly<CodesConditions>) => {
			return infos.is_alpha_player
		}
	},

	ALPHART: {
		redeem_limit: 1,
		is_redeemable: (state: Readonly<State>, infos: Readonly<CodesConditions>) => {
			return infos.is_alpha_player && infos.good_play_count < 20
		}
	},

	...TEST_CODES,
}

////////////

const ALL_CODES: Readonly<Code>[] = Object.keys(RAW_CODES).map(hkey => {
	const {
		key,
		code,
		redeem_limit,
		is_redeemable,
	} = RAW_CODES[hkey]

	if (key)
		throw new Error(`Code entry "${hkey}" redundantly specifies a key!`)
	if (hkey !== normalize_code(hkey))
		throw new Error(`Code entry "${hkey}" should have normalized form "${normalize_code(hkey)}"!`)

	return {
		key: hkey,
		code: code || hkey,
		redeem_limit,
		is_redeemable,
	} as Code
})

const CODES_BY_KEY: { [key: string]: Readonly<Code> } = ALL_CODES.reduce(
	(acc, code) => {
		acc[code.key] = code
		return acc
	},
	{} as { [key: string]: Readonly<Code> },
)

////////////

export {
	CODES_BY_KEY,
	ALL_CODES
}
