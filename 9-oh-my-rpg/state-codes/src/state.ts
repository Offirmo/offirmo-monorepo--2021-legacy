/////////////////////

import { Enum } from 'typescript-string-enums'
import { get_human_readable_UTC_timestamp_minutes } from '@offirmo/timestamps'

import { SCHEMA_VERSION } from './consts'

import {
	CodeRedemption,
	CodesConditions,
	State,
} from './types'

import { is_code_redeemable } from './selectors'

import { SoftExecutionContext, OMRContext, get_lib_SEC } from './sec'
import normalize_code from './normalize-code'

/////////////////////

function create(SEC?: SoftExecutionContext): Readonly<State> {
	return get_lib_SEC(SEC).xTry('create', ({enforce_immutability}: OMRContext) => {
		return enforce_immutability({
			schema_version: SCHEMA_VERSION,
			revision: 0,

			redeemed_codes: {},
		})
	})
}

/////////////////////

function redeem_code(SEC: SoftExecutionContext, state: Readonly<State>, code: string, infos: Readonly<CodesConditions>): Readonly<State> {
	return get_lib_SEC(SEC).xTry('redeem_code', ({enforce_immutability}: OMRContext) => {
		if (!is_code_redeemable(state, code, infos))
			throw new Error(`This code is either non-existing or non redeemable at the moment!`)

		code = normalize_code(code)

		const r: CodeRedemption = state.redeemed_codes[code] || ({
			redeem_count: 0,
			last_redeem_date_minutes: '',
		} as CodeRedemption)

		return enforce_immutability({
			...state,

			redeemed_codes: {
				...state.redeemed_codes,
				[code]: {
					...r,
					redeem_count: r.redeem_count + 1,
					last_redeem_date_minutes: get_human_readable_UTC_timestamp_minutes(),
				}
			},

			revision: state.revision + 1,
		})
	})
}

/////////////////////

export {
	State,
	create,
	redeem_code,
}

/////////////////////
