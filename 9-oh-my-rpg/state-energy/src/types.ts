import { Enum } from 'typescript-string-enums'
import { NumeratorDenominator } from 'fraction.js'

import { TimestampUTCMs } from '@offirmo/timestamps'
import { BaseUState, BaseTState } from '@offirmo-private/state'

/////////////////////

interface UState extends BaseUState {
	max_energy: number

	// allow an "onboarding" regeneration rate:
	// where energy regenerates faster at the beginning
	// Formula: https://www.desmos.com/calculator/g98bdj8vll
	//                                     C1
	// refilling rate = floor(---------------------------- + final_energy_refilling_rate_per_ms)
	//                        total_energy_refilled_so_far
	C1: number
	total_energy_consumed_so_far: number
	final_energy_refilling_rate_per_ms: NumeratorDenominator // ex. 7 / 24h will refill 7 energy in 24h
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
