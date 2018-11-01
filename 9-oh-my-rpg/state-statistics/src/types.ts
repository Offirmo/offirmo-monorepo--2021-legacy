import { Enum } from 'typescript-string-enums'

import { HumanReadableTimestampUTCMinutes } from '@offirmo/timestamps'

/////////////////////

interface State {
	// NOTE
	// This should NOT contain stuff that can be inferred from the global state
	// that would be redundant.

	// game
	good_play_count: number
	bad_play_count: number
	encountered_monsters: Set<string>
	encountered_adventures: Set<string>
	good_play_count_by_active_class: { [klass: string]: number }
	bad_play_count_by_active_class: { [klass: string]: number }

	// meta (sent from above)
	has_account: boolean
	is_registered_alpha_player: boolean

}

/////////////////////

export {
	State,
}

/////////////////////
