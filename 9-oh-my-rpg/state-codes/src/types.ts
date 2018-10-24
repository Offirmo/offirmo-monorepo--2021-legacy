import { Enum } from 'typescript-string-enums'

import { HumanReadableTimestampUTCMinutes } from '@offirmo/timestamps'

/////////////////////

interface CodesConditions {
	good_play_count: number
	is_alpha_player: boolean
	is_player_since_alpha: boolean
}

interface Code {
	key: string
	code: string
	redeem_limit: number | null // null = no limit or non-count limit (see is_redeemable)
	is_redeemable: (state: Readonly<State>, infos: Readonly<CodesConditions>) => boolean
	redemption_success_message?: string
}

interface CodeRedemption {
	redeem_count: number
	last_redeem_date_minutes: HumanReadableTimestampUTCMinutes
}
/////////////////////

interface State {
	schema_version: number
	revision: number

	redeemed_codes: { [key: string]: CodeRedemption }
}

/////////////////////

export {
	CodesConditions,
	Code,
	CodeRedemption,
	State,
}

/////////////////////
