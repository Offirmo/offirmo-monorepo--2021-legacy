/////////////////////

import deepFreeze from 'deep-freeze-strict'

import { LIB, SCHEMA_VERSION } from './consts'
import {
	Analytics,
	AchievementDefinition,
	AchievementEntry,
	AchievementStatus,
} from './types'
import ACHIEVEMENT_DEFINITIONS from './data'

import {
	State,
} from './types'

/////////////////////


function create(): State {
	return {
		schema_version: SCHEMA_VERSION,
		revision: 0,

		statistics: {},
	}
}

/////////////////////


/////////////////////
function on_analytics(state: Readonly<State>, ...analytics: Analytics[]): Readonly<State> {
	// TODO
	return state
}

/*
function add_amount(state: State, currency: Currency, amount: number): State {
	if (amount <= 0)
		throw new Error('state-wallet: can’t add a <= 0 amount')

	return change_amount_by(state, currency, amount)
}

function remove_amount(state: State, currency: Currency, amount: number): State {
	if (amount <= 0)
		throw new Error('state-wallet: can’t remove a <= 0 amount')

	if (amount > get_currency_amount(state, currency))
		throw new Error('state-wallet: can’t remove more than available, no credit !')

	return change_amount_by(state, currency, -amount)
}
*/
/////////////////////

// TODO memoize
function get_sorted_visible_achievements(state: Readonly<State>): Readonly<AchievementEntry>[] {
	const { statistics } = state

	return ACHIEVEMENT_DEFINITIONS
		.map((def: AchievementDefinition): AchievementEntry => {
			return {
				key: def.key,
				status: def.get_status(statistics),
			}
		})
		.filter(entry => entry.status !== AchievementStatus.hidden)
}

/////////////////////

export {
	create,
	get_sorted_visible_achievements
}

/////////////////////
