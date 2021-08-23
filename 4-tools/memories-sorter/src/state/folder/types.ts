import { Enum } from 'typescript-string-enums'

import { RelativePath } from '../../types'
import { BetterDate } from '../../services/better-date'
import { TimestampUTCMs } from '@offirmo-private/timestamps'

////////////////////////////////////

export const Type = Enum(
	'root',
	'inbox',

	'year',
	'event', // by default

	'overlapping_event', // used to be an event but other folders are overlapping it (or duplicate)
	'cant_recognize',
	'cant_autosort',
	'unknown', // anything else that can't be an event
)
export type Type = Enum<typeof Type> // eslint-disable-line no-redeclare

export type FolderId = RelativePath

export interface State {
	id: FolderId
	type: Type
	reason_for_demotion_from_event: null | string

	// XXX data loop by having the files using the folder then the folder using the files??

	// Date ranges from children
	children_date_ranges: {
		// ALL can be null if no children TODO review

		// needed to assess whether the fs data looks reliable in this folder
		from_fs_current: {
			begin: undefined | TimestampUTCMs
			end: undefined | TimestampUTCMs
		},

		// after 1st pass
		// EARLY/BASIC/PRIMARY range of the RELIABLE media files currently in this folder (without hints or notes)
		// This is used to hint the files and help them confirm their FS birthtime
		// needed to discriminate whether an hypothetical basename date is an event or a backup
		from_primary_current: {
			begin: undefined | BetterDate
			end: undefined | BetterDate
		},

		// after 2nd pass
		// FINAL range of the media files currently in this folder
		// This happens after the files got the hints + notes restored
		from_primary_final: {
			begin: undefined | BetterDate
			end: undefined | BetterDate
		},
	}

	// if this folder is an event, what is the range assigned to it? (may be arbitrarily set)
	event_range: {
		begin: undefined | BetterDate
		end: undefined | BetterDate
	}

	children_fs_reliability_count: {
		'unknown': number,
		'unreliable': number,
		'reliable': number,
	}

	// intermediate data for internal assertions
	children_count: number,
	children_pass_1_count: number,
	children_pass_2_count: number,
}
