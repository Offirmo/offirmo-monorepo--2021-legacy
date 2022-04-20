/////////////////////

import { Immutable} from '@offirmo-private/ts-types'
import { Random, Engine } from '@offirmo/random'

/////////////////////

import * as PRNGState from '@oh-my-rpg/state-prng'
import * as WalletState from '@oh-my-rpg/state-wallet'

import {
	get_prng,
	register_recently_used,
	regenerate_until_not_recently_encountered,
} from '@oh-my-rpg/state-prng'

import {
	AdventureType,
	AdventureArchetype,

	get_archetype,
	pick_random_good_archetype,
	pick_random_bad_archetype,
} from '@oh-my-rpg/logic-adventures'

/////////////////////

import { LIB } from '../../consts'
import { State, UState } from '../../types'
import { _play_adventure } from './play_adventure'

/////////////////////

const ADVENTURE_GOOD_NON_REPETITION_ID = 'adventure_archetype--good'
const ADVENTURE_GOOD_NON_REPETITION_COUNT = 30

function pick_random_non_repetitive_good_archetype(u_state: Immutable<UState>, rng: Engine): Immutable<AdventureArchetype> {
	let archetype: AdventureArchetype

	regenerate_until_not_recently_encountered({
		id: ADVENTURE_GOOD_NON_REPETITION_ID,
		generate: () => {
			archetype = pick_random_good_archetype(rng)
			return archetype.hid
		},
		state: u_state.prng,
		max_tries: ADVENTURE_GOOD_NON_REPETITION_COUNT * 10,
	})

	return archetype!
}

function pick_ideal_non_repetitive_good_archetype(u_state: Immutable<UState>, rng: Engine): Immutable<AdventureArchetype> {
	//console.log(WalletState.get_currency_amount(u_state.wallet, WalletState.Currency.coin))
	if (WalletState.get_currency_amount(u_state.wallet, WalletState.Currency.coin) === 0) {
		// needed to prevent the wallet from staying at 0
		// which mess up adventures needing a coin loss
		return get_archetype('found_coin')
	}

	return pick_random_non_repetitive_good_archetype(u_state, rng)
}

function _play_good(state: Immutable<State>, explicit_adventure_archetype_hid?: string): Immutable<State> {
	let prng_state = state.u_state.prng
	const rng = get_prng(prng_state)

	const aa: AdventureArchetype = explicit_adventure_archetype_hid
		? get_archetype(explicit_adventure_archetype_hid)
		: pick_ideal_non_repetitive_good_archetype(state.u_state, rng)

	if (!aa)
		throw new Error(`${LIB}: play_good(): hinted adventure archetype "${explicit_adventure_archetype_hid}" could not be found!`)

	if (!aa.good) // this feature is for test only, so means wrong test
		throw new Error(`${LIB}: play_good(): hinted adventure archetype "${explicit_adventure_archetype_hid}" is a "bad click" one!`)

	if (!explicit_adventure_archetype_hid) {
		prng_state = PRNGState.update_use_count(state.u_state.prng, rng)
	}

	state = {
		...state,
		u_state: {
			...state.u_state,
			prng: register_recently_used(
				prng_state,
				ADVENTURE_GOOD_NON_REPETITION_ID,
				aa.hid,
				ADVENTURE_GOOD_NON_REPETITION_COUNT,
			),
		},
	}

	state = _play_adventure(state, aa)

	return state
}

/////////////////////

export {
	_play_good,
}

/////////////////////
