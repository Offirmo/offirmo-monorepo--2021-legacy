import { Enum } from 'typescript-string-enums'

import { RelativePath, TimeZone } from '../../types'
import { BetterDate, DateRange } from '../../services/better-date'
import { TimestampUTCMs } from '@offirmo-private/timestamps'

////////////////////////////////////

export const Type = Enum(
	'root',
	'inbox', // not really needed but nice

	'year',
	'event', // by default until proven otherwise

	'overlapping_event', // used to be an event but other folders are overlapping it (or duplicate)
	'cant_recognize',
	'cant_autosort',
	'unknown', // anything else that can't be an event, ex. TODO ???
)
export type Type = Enum<typeof Type> // eslint-disable-line no-redeclare

export type FolderId = RelativePath

export interface State {
	id: FolderId
	type: Type
	reason_for_demotion_from_event: null | string

	// if this folder is an event, what is the range assigned to it?
	// the range is normally inferred (from basename + children)
	// this prop allows to override it, ex. in case of overlap
	// Note: null = no override, can only be overriden to an actual range
	forced_event_range: null | DateRange

	// various creation date ranges from children:
	media_children_bcd_ranges: {
		// ALL can be empty if no children

		// after 1st pass
		// info needed to assess whether the fs info looks reliable in this folder
		from_fsⵧcurrent: undefined | null | DateRange<TimestampUTCMs>

		// after 1st pass
		// EARLY/BASIC/PRIMARY range of the RELIABLE media files currently in this folder (without hints or notes)
		// This is used to hint the files and help them confirm their FS birthtime
		// also needed to discriminate whether an hypothetical basename date is an event or a backup
		from_primaryⵧcurrentⵧphase_1: undefined | null | DateRange

		// after 2nd pass
		// FINAL range of the media files currently in this folder
		// This happens after the files got their notes restored + our hints
		from_primaryⵧfinal: undefined | null | DateRange
	}

	// we need a unified timezone to properly do date arithmetic
	// and also to properly generate basenames
	media_children_aggregated_tz: undefined | TimeZone | 'tz:auto'

	// after 1st pass
	media_children_fs_reliability_count: {
		'unknown': number,
		'unreliable': number,
		'reliable': number,
	}

	// intermediate data for internal assertions
	//status: 'data-gathering-1' | 'data-gathering-2' | 'sorting'   NO!!! folders can be created late (during sorting phase) and should immediately be valid
	media_children_count: number, // initial fs exploration
	media_children_pass_1_count: number, // fs exploration
	media_children_pass_2_count: number, // consolidation
}
