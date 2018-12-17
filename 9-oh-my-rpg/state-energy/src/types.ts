import { Enum } from 'typescript-string-enums'
import { NumeratorDenominator } from 'fraction.js'

import { TimestampUTCMs } from '@offirmo/timestamps'

/////////////////////

interface UState {
	schema_version: number
	revision: number

	max_energy: number

	// ex. 7 / 24h will refill 7 energy in 24h
	energy_refilling_rate_per_ms: NumeratorDenominator
}

interface TState {
	schema_version: number

	timestamp_ms: TimestampUTCMs

	available_energy: NumeratorDenominator
}

////////////

interface Derived {
	// TODO
}

/////////////////////

export {
	UState,
	TState,
	Derived,
}

/////////////////////
