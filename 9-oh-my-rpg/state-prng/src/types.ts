import { BaseUState } from '@offirmo-private/state'

/////////////////////

// TODO improve offirmo/random
import { MT19937 } from '@offirmo/random'
interface MTEngineWithSeed extends MT19937 {
	_seed?: number
}


interface State extends BaseUState {
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
	MTEngineWithSeed,
	State,
}

/////////////////////
