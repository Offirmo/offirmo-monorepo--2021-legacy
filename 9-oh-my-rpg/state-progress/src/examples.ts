import deepFreeze from 'deep-freeze-strict'

import { State } from './types'

/////////////////////

const TRUE_TRUE: true = true // https://github.com/Microsoft/TypeScript/issues/19360

// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE: State = deepFreeze({
	schema_version: 1,
	revision: 42,

	wiki: null,
	flags: null,
	achievements: {
		"TEST": "unlocked",
		"Summoned": "unlocked",
		"Alpha player": "unlocked",
		"Beta player": "revealed",
		"I am bored": "unlocked",
		"Turn it up to eleven": "unlocked",
		"I am dead bored": "revealed",
		"did I mention I was bored?": "hidden",
		"king of boredom": "hidden",
		"No-life except for boredom": "hidden",
		"Hello darkness my old friend": "revealed",
		"What’s in a name?": "unlocked",
		"Graduated": "unlocked",
		"I am very bored": "unlocked",
		"Sorry my hand slipped": "unlocked",
		"Oops!... I Did It Again": "unlocked",
		"I’m not that innocent": "unlocked",
		"It’s good to be bad": "unlocked",
	},

	statistics: {
		good_play_count: 12,
		bad_play_count: 3,
		encountered_adventures: {
			'caravan_success': TRUE_TRUE,
			'dying_man': TRUE_TRUE,
			'ate_bacon': TRUE_TRUE,
			'ate_zombie': TRUE_TRUE,
			'refreshing_nap': TRUE_TRUE,
			'older': TRUE_TRUE,
		},
		encountered_monsters: {
			'wolf': TRUE_TRUE,
			'spreading adder': TRUE_TRUE,
			'fur-bearing truit': TRUE_TRUE,
		},
		good_play_count_by_active_class: {
			'novice': 7,
			'warrior': 5,
		},
		bad_play_count_by_active_class: {
			'novice': 2,
			'warrior': 1,
		},
		has_account: true,
		is_registered_alpha_player: false,
	}
})

/////////////////////

export {
	DEMO_STATE,
}
