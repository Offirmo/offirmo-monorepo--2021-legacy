
import { Code, CodesConditions, State } from '../types'

////////////

const BORED: Code = {
	uuid: 'BORED',
	text: 'BORED',
	redeem_limit: null,
	is_redeemable: (state: Readonly<State>, current: Readonly<CodesConditions>) => {
		return false // TODO
	}
}

const ALPHA_MIGRANT: Code = {
	uuid: 'ALPHA-MIGRANT',
	text: 'ALPHA-MIGRANT',
	redeem_limit: 1,
	is_redeemable: (state: Readonly<State>, current: Readonly<CodesConditions>) => {
		return current.is_alpha_player && current.good_play_count < 20
	}
}

////////////

const CODES: { [key: string]: Code } = {
	BORED,
	ALPHA_MIGRANT,
}

export default CODES
