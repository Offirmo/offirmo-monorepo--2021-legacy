import { Enum } from 'typescript-string-enums'

import { HumanReadableTimestampUTCMinutes } from '@offirmo/timestamps'
/////////////////////

interface CodesConditions {
	good_play_count: number
	is_alpha_player: boolean
}

interface Code {
	uuid: string
	text: string
	redeem_limit: number | null // null = no limit or non-count limit (see is_redeemable)
	is_redeemable: (state: Readonly<State>, current: Readonly<CodesConditions>) => boolean
}

interface CodeRedemption {
	code_uuid: string
	redeem_count: number
	last_redeem_date: HumanReadableTimestampUTCMinutes
}
/////////////////////

interface State {
	schema_version: number
	revision: number

	redeemed_codes: string[]
}

/////////////////////

export {
	State,
}

/////////////////////
