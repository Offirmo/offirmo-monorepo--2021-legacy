
import { Immutable, enforce_immutability } from '@offirmo-private/state-utils'

import { NeighborHints, HistoricalNeighborHints } from './types'
import { get_historical_representation } from './selectors'

/////////////////////


export const DEMO_STATE: Immutable<NeighborHints> = enforce_immutability<NeighborHints>({
	bcdⵧfrom_fs__reliabilityⵧassessed_from_phase1: 'unknown',
})

export const DEMO_STATEⵧHISTORICAL: Immutable<HistoricalNeighborHints> = enforce_immutability<HistoricalNeighborHints>(
	get_historical_representation(DEMO_STATE)
)

/////////////////////
