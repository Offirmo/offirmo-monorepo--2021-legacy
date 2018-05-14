import { Enum } from 'typescript-string-enums'

import { HumanReadableTimestampUTCMs } from '@offirmo/timestamps'

/////////////////////

interface EnergyUsage {
	date: HumanReadableTimestampUTCMs
	energy_consumed: number // usually 1
}

interface State {
	schema_version: number
	revision: number

	max_energy: number
	base_energy_refilling_rate_per_day: number // ex. 7 = will refill 7 energy in 24h

	last_date: HumanReadableTimestampUTCMs
	last_available_energy_float: number
	//last_energy_usages: EnergyUsage[] // empty at start, at most max_energy entries, FIFO
}

// only valid on a specific date
interface Snapshot {
	available_energy: number
	available_energy_float: number
	human_time_to_next: string
	total_energy_refilling_ratio: number // 0-1, 1 = fully refilled

	//is_well_rested: boolean
	//good_rest_refilling_ratio: number // 0-1, 1 = fully rested
}

/////////////////////

export {
	EnergyUsage,
	State,
	Snapshot,
}

/////////////////////
