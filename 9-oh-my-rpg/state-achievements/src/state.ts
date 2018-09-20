/////////////////////

import deepFreeze from 'deep-freeze-strict'

import { LIB, SCHEMA_VERSION } from './consts'

import {
	State,
} from './types'

/////////////////////


function create(): State {
	return {
		schema_version: SCHEMA_VERSION,
		revision: 0,


	}
}

/////////////////////


/////////////////////

function add_amount(state: State, currency: Currency, amount: number): State {
	if (amount <= 0)
		throw new Error('state-wallet: can\'t add a <= 0 amount')

	return change_amount_by(state, currency, amount)
}

function remove_amount(state: State, currency: Currency, amount: number): State {
	if (amount <= 0)
		throw new Error('state-wallet: can\'t remove a <= 0 amount')

	if (amount > get_currency_amount(state, currency))
		throw new Error('state-wallet: can\'t remove more than available, no credit !')

	return change_amount_by(state, currency, -amount)
}

/////////////////////

function get_sorted_visible_achievements(state: Readonly<State>): number {
	return (state as any)[currency_to_state_entry(currency)]
}


/////////////////////

// needed to test migrations, both here and in composing parents

// a full featured, non-trivial demo state
// needed for demos
const DEMO_STATE: State = deepFreeze({
	schema_version: 1,
	revision: 42,

	coin_count: 23456,
	token_count: 89,
})

// the oldest format we can migrate from
// must correspond to state above
const OLDEST_LEGACY_STATE_FOR_TESTS: any = deepFreeze({
	// no schema_version = 0

	coin_count: 23456,
	token_count: 89,
})

// some hints may be needed to migrate to demo state
const MIGRATION_HINTS_FOR_TESTS: any = deepFreeze({
	to_v1: {
		revision: 42
	},
})

/////////////////////

export {
	Currency,
	State,
	ALL_CURRENCIES,

	create,
	add_amount,
	remove_amount,

	get_currency_amount,
	iterables_currency,

	DEMO_STATE,
	OLDEST_LEGACY_STATE_FOR_TESTS,
	MIGRATION_HINTS_FOR_TESTS,
}

/////////////////////
