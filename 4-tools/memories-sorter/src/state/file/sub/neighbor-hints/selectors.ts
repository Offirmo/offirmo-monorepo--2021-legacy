import { Immutable } from '@offirmo-private/ts-types'
import { TimestampUTCMs } from '@offirmo-private/timestamps'

import { NeighborHints, HistoricalNeighborHints, FsReliability } from './types'
import {
	BetterDate,
	DateRange,
	BetterDateMembers,
	get_debug_representation as get_better_date_debug_representation,
	get_timestamp_utc_ms_from,
} from '../../../../services/better-date'

/////////////////////

export function get_expected_bcd_range(): undefined | DateRange {
	throw new Error('NIMP NeighborHints get_expected_bcd_range()')
}

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
	if (state._unit_test_shortcut)
		return state._unit_test_shortcut === 'reliable'

	//return false
	throw new Error('NIMP is_matching_parent_folder_expected_date_range')
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

	let result = '[hints:'

	const {
		//bcdⵧfrom_fs__reliabilityⵧassessed_from_phase1,
		_unit_test_shortcut,
		...unhandled
	} = state

	if (_unit_test_shortcut) {
		result += 'force:' + _unit_test_shortcut
	}
	else {
		if (Object.keys(unhandled).length > 0)
			throw new Error('NIMP to_string!')
	}

	result += ']'

	return result
}

///////////////////// historical /////////////////////

export function get_historical_representation(state: Immutable<NeighborHints>, fs_bcd‿tms: TimestampUTCMs): HistoricalNeighborHints {
	const { _unit_test_shortcut, bcdⵧfrom_fs__reliabilityⵧassessed_from_phase1, ...unhandled } = state

	if (_unit_test_shortcut) {
		return {
			fs_reliability: _unit_test_shortcut,
		}
	}

	if (Object.keys(unhandled).length > 0)
		throw new Error('get_historical_representation() needs update!')

	if (bcdⵧfrom_fs__reliabilityⵧassessed_from_phase1 !== 'unknown') {
		console.log(state, fs_bcd‿tms)
		throw new Error('NIMP get_historical_representation()')
	}

	return {
		fs_reliability: 'unknown',
	}
}

export function get_historical_fs_reliability(state: Immutable<HistoricalNeighborHints>, candidate‿tms: TimestampUTCMs): FsReliability {
	console.log('ghr', state)
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
	const { /*fs_reliability,*/ ...unhandled } = state

	if (Object.keys(unhandled).length > 0)
		throw new Error('NIMP to_stringⵧhistorical!')

	return '<HistoricalNeighborHints>'
}
