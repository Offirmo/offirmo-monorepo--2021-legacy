/////////////////////

import { Immutable, enforce_immutability } from '@offirmo-private/state-utils'

import { LIB, SCHEMA_VERSION } from './consts'

import {
	Currency,
	State,
} from './types'

/////////////////////

const ALL_CURRENCIES: Currency[] = [
	Currency.coin,
	Currency.token,
]

function create(): Immutable<State> {
	return {
		schema_version: SCHEMA_VERSION,
		revision: 0,

		coin_count: 0,
		token_count: 0,
	}
}

/////////////////////

function currency_to_state_entry(currency: Currency): string {
	switch(currency) {
		case Currency.coin:
		case Currency.token:
			return `${currency}_count`

		default:
			throw new Error(`state-wallet: unrecognized currency: "${currency}`)
	}
}

function change_amount_by(state: Immutable<State>, currency: Currency, amount: number): Immutable<State> {
	const state_entry = currency_to_state_entry(currency)

	return {
		...state,

		[state_entry]: (state as any)[state_entry] + amount,

		revision: state.revision + 1,
	}
}

/////////////////////

function add_amount(state: Immutable<State>, currency: Currency, amount: number): Immutable<State> {
	if (amount <= 0)
		throw new Error('state-wallet: can’t add a <= 0 amount')

	return change_amount_by(state, currency, amount)
}

function remove_amount(state: Immutable<State>, currency: Currency, amount: number): Immutable<State> {
	if (amount <= 0)
		throw new Error('state-wallet: can’t remove a <= 0 amount')

	if (amount > get_currency_amount(state, currency))
		throw new Error('state-wallet: can’t remove more than available, no credit !')

	return change_amount_by(state, currency, -amount)
}

/////////////////////

function get_currency_amount(state: Immutable<State>, currency: Currency): number {
	return (state as any)[currency_to_state_entry(currency)]
}

function* iterables_currency(state: Immutable<State>) {
	yield* ALL_CURRENCIES
}

/////////////////////

export {
	ALL_CURRENCIES,

	create,
	add_amount,
	remove_amount,

	get_currency_amount,
	iterables_currency,
}

/////////////////////
