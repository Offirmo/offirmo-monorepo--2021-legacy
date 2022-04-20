
import { Immutable, enforce_immutability } from '@offirmo-private/state-utils'

import { REAL_CREATION_DATE‿TMS } from '../../../../__test_shared/utils'
import { create_better_date_from_utc_tms } from '../../../../services/better-date'

import { NeighborHints, HistoricalNeighborHints } from './types'
import { get_historical_representation } from './selectors'

/////////////////////


export const DEMO_STATE: Immutable<NeighborHints> = enforce_immutability<NeighborHints>({
	bcdⵧfrom_fs__reliabilityⵧassessed_from_phase1: 'unknown',
	expected_bcd_ranges: [
		{
			begin: create_better_date_from_utc_tms(REAL_CREATION_DATE‿TMS, 'tz:auto'),
			end: create_better_date_from_utc_tms(REAL_CREATION_DATE‿TMS + 12345678, 'tz:auto'),
		}
	],
	fallback_junk_bcd: create_better_date_from_utc_tms(REAL_CREATION_DATE‿TMS, 'tz:auto'),
	tz: undefined, // TODO
})

/*export const DEMO_STATEⵧHISTORICAL: Immutable<HistoricalNeighborHints> = enforce_immutability<HistoricalNeighborHints>(
	get_historical_representation(DEMO_STATE)
)*/

/////////////////////
