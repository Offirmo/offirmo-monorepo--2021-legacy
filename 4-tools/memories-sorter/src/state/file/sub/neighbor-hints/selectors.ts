import assert from 'tiny-invariant'
import { Immutable } from '@offirmo-private/ts-types'
import { TimestampUTCMs } from '@offirmo-private/timestamps'

import logger from '../../../../services/logger'
import { NeighborHints, HistoricalNeighborHints, FsReliability } from './types'
import {
	BetterDate,
	DateRange,
	BetterDateMembers,
	get_debug_representation as get_better_date_debug_representation,
	get_timestamp_utc_ms_from, get_debug_representation,
	create_better_date_from_utc_tms,
} from '../../../../services/better-date'

/////////////////////

export function get_expected_bcd_range(): undefined | DateRange {
	throw new Error('NIMP NeighborHints get_expected_bcd_range()')
}

///////////////////// Current /////////////////////

export function get_neighbors_fs_reliability(state: Immutable<NeighborHints>): FsReliability {
	return state.bcdⵧfrom_fs__reliabilityⵧassessed_from_phase1
}

export function get_fallback_junk_bcd(state: Immutable<NeighborHints>): undefined | BetterDate {
	return state.fallback_junk_bcd
}

export function is_matching_parent_folder_expected_date_ranges(state: Immutable<NeighborHints>, candidate: Immutable<BetterDate>): boolean {
	//return false
	throw new Error('NIMP is_matching_parent_folder_expected_date_ranges')

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

export function is_candidate_fs_bcd_looking_reliable_according_to_neighbor_hints(state: Immutable<NeighborHints>, candidate‿tms: TimestampUTCMs): FsReliability {
	if (state._unit_test_shortcut)
		return state._unit_test_shortcut

	assert(!!candidate‿tms, `is_candidate_fs_bcd_looking_reliable_according_to_neighbor_hints() candidate should be truthy!`)

	const candidate = create_better_date_from_utc_tms(candidate‿tms, 'tz:auto')

	if (is_matching_parent_folder_expected_date_ranges(state, candidate)) {
		logger.trace(`is_candidate_fs_bcd_looking_reliable_according_to_neighbor_hints() current fs reliability has been assessed to "reliable" from our fs + parent folder date ranges`)
		return 'reliable'
	}

	// still unknown
	const siblings_fs_bcd_assessed_reliability = get_neighbors_fs_reliability(state)
	switch(siblings_fs_bcd_assessed_reliability) {
		case 'reliable':
			logger.trace(`is_candidate_fs_bcd_looking_reliable_according_to_neighbor_hints() current fs reliability has been assessed to "reliable" from parent reliability=reliable, assuming ours is reliable as well`)
			return 'reliable'
		case 'unreliable':
			// NO! Don't allow a single bad file to pollute an entire folder
			// ok we're not "reliable", but can't say that we're unreliable
			// fallthrough
		default:
			// fallthrough
			break
	}

	logger.trace(`is_candidate_fs_bcd_looking_reliable_according_to_neighbor_hints() current fs reliability has been assessed to "unknown" from fallback`)
	return 'unknown'
}

export function to_string(state: undefined | Immutable<NeighborHints>): any {
	if (!state)
		return undefined

	let result = '[hints:'

	const {
		_unit_test_shortcut,
		bcdⵧfrom_fs__reliabilityⵧassessed_from_phase1,
		expected_bcd_ranges,
		fallback_junk_bcd,
		...unhandled
	} = state

	if (_unit_test_shortcut) {
		result += 'force:' + _unit_test_shortcut
	}
	else {
		if (Object.keys(unhandled).length > 0)
			throw new Error('NIMP to_string!')

		result += `${expected_bcd_ranges.length} ranges; fb-junk-date=${get_debug_representation(fallback_junk_bcd)}`
	}

	result += ']'

	return result
}

///////////////////// historical /////////////////////

export function get_historical_representation(state: Immutable<NeighborHints>, fs_bcd‿tms: undefined | TimestampUTCMs): HistoricalNeighborHints {
	const {
		_unit_test_shortcut,
		bcdⵧfrom_fs__reliabilityⵧassessed_from_phase1,
		...unhandled
	} = state

	if (_unit_test_shortcut) {
		return {
			fs_reliability: _unit_test_shortcut,
		}
	}

	if (fs_bcd‿tms === undefined) {
		return {
			fs_reliability: 'unknown',
		}
	}

	return {
		fs_reliability: is_candidate_fs_bcd_looking_reliable_according_to_neighbor_hints(state, fs_bcd‿tms)
	}
}

export function get_historical_fs_reliability(state: Immutable<HistoricalNeighborHints>, candidate‿tms: TimestampUTCMs): FsReliability {
	console.log('get_historical_fs_reliability()', state)
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
