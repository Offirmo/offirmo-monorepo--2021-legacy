import { Enum } from 'typescript-string-enums'
import { NumeratorDenominator } from 'fraction.js'

import { TimestampUTCMs } from '@offirmo/timestamps'
import { BaseUState, BaseTState } from '@offirmo-private/state'

/////////////////////

interface UState extends BaseUState {
	max_energy: number

	// ex. 7 / 24h will refill 7 energy in 24h
	energy_refilling_rate_per_ms: NumeratorDenominator
}

interface TState extends BaseTState {
	timestamp_ms: TimestampUTCMs

	available_energy: NumeratorDenominator
}

////////////

interface Derived {
	available_energy_int: number
	available_energy_float: number
	human_time_to_next: string // ex. "3h" until next energy
	next_energy_refilling_ratio: number // to be able to display "53%"

	/*
	available_energy: number
	total_energy_refilling_ratio: number // 0-1, 1 = fully refilled

	last_date: HumanReadableTimestampUTCMs
	last_available_energy_float: number
	*/
}

/////////////////////

export {
	UState,
	TState,
	Derived,
}

/////////////////////
