/////////////////////

import { Immutable, enforce_immutability } from '@offirmo-private/state-utils'
import { get_human_readable_UTC_timestamp_minutes } from '@offirmo-private/timestamps'

import { SCHEMA_VERSION } from './consts'

import {
	CodeSpec,
	CodeRedemption,
	State,
} from './types'

import { is_code_redeemable } from './selectors'

import { OMRSoftExecutionContext, get_lib_SEC } from './sec'

/////////////////////

function create(SEC?: OMRSoftExecutionContext): Immutable<State> {
	return get_lib_SEC(SEC).xTry('create', () => {
		return enforce_immutability<State>({
			schema_version: SCHEMA_VERSION,
			revision: 0,

			redeemed_codes: {},
		})
	})
}

/////////////////////

function attempt_to_redeem_code<T>(state: Immutable<State>, code_spec: Immutable<CodeSpec<T>>, infos: Immutable<T>): Immutable<State> {
	return get_lib_SEC().xTry('redeem_code', (): Immutable<State> => {
		if (!is_code_redeemable(state, code_spec, infos))
			throw new Error('This code is either non-existing or non redeemable at the moment!')

		const code = code_spec.code

		const r: CodeRedemption = state.redeemed_codes[code] || ({
			redeem_count: 0,
			last_redeem_date_minutes: '',
		} as CodeRedemption)

		return enforce_immutability<State>({
			...state,

			redeemed_codes: {
				...state.redeemed_codes,
				[code]: {
					...r,
					redeem_count: r.redeem_count + 1,
					last_redeem_date_minutes: get_human_readable_UTC_timestamp_minutes(),
				},
			},

			revision: state.revision + 1,
		})
	})
}

/////////////////////

export {
	create,
	attempt_to_redeem_code,
}

/////////////////////
