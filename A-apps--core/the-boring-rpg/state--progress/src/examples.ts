import { Immutable, enforce_immutability } from '@offirmo-private/state-utils'
import { get_human_readable_UTC_timestamp_days, TEST_TIMESTAMP_MS } from '@offirmo-private/timestamps'

import { State, AchievementStatus } from './types'

/////////////////////

const TRUE_TRUE: true = true // https://github.com/Microsoft/TypeScript/issues/19360

// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE: Immutable<State> = enforce_immutability<State>({
	schema_version: 3,
	revision: 42,

	wiki: null,
	flags: null,
	achievements: {
		'TEST': AchievementStatus.unlocked,
		'Summoned': AchievementStatus.unlocked,
		'Alpha player': AchievementStatus.unlocked,
		'Beta player': AchievementStatus.revealed,
		'I am bored': AchievementStatus.unlocked,
		'Turn it up to eleven': AchievementStatus.unlocked,
		'I am dead bored': AchievementStatus.revealed,
		'did I mention I was bored?': AchievementStatus.hidden,
		'king of boredom': AchievementStatus.hidden,
		'No-life except for boredom': AchievementStatus.hidden,
		'Hello darkness my old friend': AchievementStatus.hidden,
		'What’s in a name?': AchievementStatus.unlocked,
		'Graduated': AchievementStatus.unlocked,
		'I am very bored': AchievementStatus.unlocked,
		'Sorry my hand slipped': AchievementStatus.unlocked,
		'Oops!... I Did It Again': AchievementStatus.unlocked,
		'I’m not that innocent': AchievementStatus.revealed,
		'It’s good to be bad': AchievementStatus.hidden,
	},

	statistics: {
		creation_date_hrtday: get_human_readable_UTC_timestamp_days(new Date(TEST_TIMESTAMP_MS - 100_000)),
		last_visited_timestamp_hrtday: get_human_readable_UTC_timestamp_days(new Date(TEST_TIMESTAMP_MS)),
		active_day_count: 12,
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
		fight_won_count: 6,
		fight_lost_count: 4,
		coins_gained: 1234,
		tokens_gained: 2,
		items_gained: 3,

		has_account: true,
		is_registered_alpha_player: false,
	},
})

/////////////////////

export {
	DEMO_STATE,
}
