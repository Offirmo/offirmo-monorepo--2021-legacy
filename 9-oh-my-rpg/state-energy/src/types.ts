import { Enum } from 'typescript-string-enums'

import { HumanReadableTimestampUTCMs } from '@offirmo/timestamps'

/////////////////////

interface State {
	schema_version: number
	revision: number

	max_energy: number
	// TODO review (store a bonus instead ?)
	base_energy_refilling_rate_per_day: number // ex. 7 = will refill 7 energy in 24h

	last_date: HumanReadableTimestampUTCMs
	last_available_energy_float: number
}

// only valid on a specific date
interface Snapshot {
	available_energy: number
	available_energy_float: number
	total_energy_refilling_ratio: number // 0-1, 1 = fully refilled

	next_energy_refilling_ratio: number // 0-1, 1 = n/a (fully refilled)
	human_time_to_next: string

	//is_well_rested: boolean
	//good_rest_refilling_ratio: number // 0-1, 1 = fully rested
}

/////////////////////

export {
	State,
	Snapshot,
}

/////////////////////
