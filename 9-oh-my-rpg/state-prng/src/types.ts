import { BaseUState } from '@offirmo-private/state-utils'
import { UUID } from '@offirmo-private/uuid'

/////////////////////

// TODO improve offirmo/random
import { MT19937 } from '@offirmo/random'
interface MT19937WithSeed extends MT19937 {
	_seed?: number
}


interface State extends BaseUState {
	uuid: UUID // for caching / debug. Do not mind.

	// reflect @offirmo/random Mersenne twister state
	seed: number
	use_count: number

	// prevent repetition
	recently_encountered_by_id: {
		[k: string]: Array<string | number>
	}
}


/////////////////////

export {
	MT19937WithSeed,
	State,
}

/////////////////////
