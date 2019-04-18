import { Enum } from 'typescript-string-enums'
import { NumeratorDenominator } from 'fraction.js'

import { TimestampUTCMs } from '@offirmo-private/timestamps'
import { BaseUState, BaseTState } from '@offirmo-private/state'

/////////////////////

interface UState extends BaseUState {
	max_energy: number
	total_energy_consumed_so_far: number
}

interface TState extends BaseTState {
	timestamp_ms: TimestampUTCMs

	available_energy: NumeratorDenominator
}

/////////////////////

export {
	UState,
	TState,
}

/////////////////////
