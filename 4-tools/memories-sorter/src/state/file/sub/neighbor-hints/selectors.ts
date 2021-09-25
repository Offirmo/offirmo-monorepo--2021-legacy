import { Immutable } from '@offirmo-private/ts-types'

import { NeighborHints, HistoricalNeighborHints, FsReliability } from './types'
import {
	BetterDate,
	get_debug_representation as get_better_date_debug_representation,
	get_timestamp_utc_ms_from,
} from '../../../../services/better-date'
import { TimestampUTCMs } from '@offirmo-private/timestamps/src'

///////////////////// Current /////////////////////

export function get_fs_reliability(state: Immutable<NeighborHints>): any {
	return state.bcdⵧfrom_fs__reliabilityⵧassessed_from_phase1
}

export function get_bcd(state: Immutable<NeighborHints>): undefined | BetterDate {
	throw new Error('NIMP NeighborHints')
	/*	if(state.current_neighbor_hints.parent_folder_bcd)
			return state.current_neighbor_hints.parent_folder_bcd

		return undefined*/
}

export function is_matching_parent_folder_expected_date_range(state: Immutable<NeighborHints>, candidate: Immutable<BetterDate>): boolean {
	return false
//	throw new Error('NIMP is_matching_parent_folder_expected_date_range')
/*
const bcd__from_parent_folder__current = neighbor_hints.parent_folder_bcd
if (bcd__from_parent_folder__current) {
	const bcd__from_parent_folder__current‿tms = get_timestamp_utc_ms_from(bcd__from_parent_folder__current)

	if (bcdⵧfrom_fsⵧcurrent‿tms >= bcd__from_parent_folder__current‿tms
		&& bcdⵧfrom_fsⵧcurrent‿tms < (bcd__from_parent_folder__current‿tms + PARAMS.max_event_durationⳇₓday * DAY_IN_MILLIS)) {
		// ok, looks like an event folder configuration
		logger.trace(`_get_current_fs_reliability_according_to_own_and_env() current fs reliability has been assessed to "reliable" from our fs + parent folder bcd`)
		return 'reliable'
	}*/
}

export function to_string(state: undefined | Immutable<NeighborHints>): any {
	if (!state)
		return undefined

	if (Object.keys(state).length !== 1)
		throw new Error('NIMP to_string!')

	const { bcdⵧfrom_fs__reliabilityⵧassessed_from_phase1 } = state
	return {
		bcdⵧfrom_fs__reliabilityⵧassessed_from_phase1,
	}

	/*return {
		'TODO': 'rework',
		//parent_folder_bcd: get_better_date_debug_representation(neighbor_hints.parent_folder_bcd),
		//fs_bcd_assessed_reliability: state.fs_bcd_assessed_reliability,
	}*/
}

///////////////////// historical /////////////////////

export function get_historical_representation(state: Immutable<NeighborHints>): HistoricalNeighborHints {
	if (Object.keys(state).length !== 1)
		throw new Error('NIMP get_historical_representation!')

	return {
		fs_reliability: state.bcdⵧfrom_fs__reliabilityⵧassessed_from_phase1,
	}
}

export function get_historical_fs_reliability(state: Immutable<HistoricalNeighborHints>, candidate‿tms: TimestampUTCMs): FsReliability {
	return state.fs_reliability
	/*
	const bcd__from_parent_folder__current = neighbor_hints.parent_folder_bcd
	if (bcd__from_parent_folder__current) {
		const bcd__from_parent_folder__current‿tms = get_timestamp_utc_ms_from(bcd__from_parent_folder__current)

		if (bcdⵧfrom_fsⵧcurrent‿tms >= bcd__from_parent_folder__current‿tms
			&& bcdⵧfrom_fsⵧcurrent‿tms < (bcd__from_parent_folder__current‿tms + PARAMS.max_event_durationⳇₓday * DAY_IN_MILLIS)) {
			// ok, looks like an event folder configuration
			logger.trace(`_get_current_fs_reliability_according_to_own_and_env() current fs reliability has been assessed to "reliable" from our fs + parent folder bcd`)
			return 'reliable'
		}*/
}

export function to_stringⵧhistorical(state: Immutable<HistoricalNeighborHints>): any {
	if (Object.keys(state).length !== 1)
		throw new Error('NIMP to_stringⵧhistorical!')

	const { fs_reliability } = state

	return '<HistoricalNeighborHints>'}
