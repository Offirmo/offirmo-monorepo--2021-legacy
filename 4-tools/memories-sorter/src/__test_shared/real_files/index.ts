import path from 'path'

import memoize_once from 'memoize-one'
import micro_memoize from 'micro-memoize'
import { Immutable } from '@offirmo-private/ts-types'
import { expect } from 'chai'
import { enforce_immutability } from '@offirmo-private/state-utils'
import { utimes } from 'utimes'

import { AbsolutePath, Basename, SimpleYYYYMMDD, ISODateString, RelativePath, TimeZone } from '../../types'
import { _UNSAFE_CURRENT_SYSTEM_TIMEZONE } from '../../params'
import { load_real_media_file as _load_real_media_file } from '../utils'
import {
	State,
	get_best_creation_date,
	_get_best_creation_date‿compact,
	get_best_creation_date__year,
	get_ideal_basename,
	DateConfidence, NeighborHints, PersistedNotes,
} from '../../state/file'
import {
	get_embedded_timezone,
	get_human_readable_timestamp_auto,
} from '../../services/better-date'
import * as FileLib from '../../state/file'

/////////////////////////////////////////////////

const TEST_FILES_DIR: RelativePath = '../../../../src/__test_shared/real_files'
export const TEST_FILES_DIR_ABS = path.join(__dirname, TEST_FILES_DIR)

interface MediaDemo {
	BASENAME: Basename
	ABS_PATH: AbsolutePath

	UTIME_MS: number
	EXIF_DATA: null | {
		EMBEDDED_TZ: TimeZone | undefined
		FINAL_TZ: TimeZone | undefined
		YEAR: number | undefined
		DATE__COMPACT: SimpleYYYYMMDD | undefined
		DATE__ISO_STRING: ISODateString | undefined
		DATE__HUMAN_AUTO: string | undefined
	}

	FINAL_TZ: TimeZone
	YEAR: number
	DATE__COMPACT: SimpleYYYYMMDD
	DATE__HUMAN_AUTO: string
	CONFIDENCE: DateConfidence

	IDEAL_BASENAME: Basename
}

const load_real_media_file = micro_memoize(_load_real_media_file, {
	maxSize: Number.MAX_SAFE_INTEGER,
})

async function _get_demo_state(
	MEDIA: MediaDemo,
	phase2?: {
		neighbor_hints: null | Immutable<NeighborHints>
		recovered_notes: null | Immutable<PersistedNotes>
	}
): Promise<Immutable<State>> {
	let state = await load_real_media_file(MEDIA.ABS_PATH)

	expect(FileLib.is_media_file(state)).to.be.true

	if (phase2) {
		state = FileLib.on_info_read__current_neighbors_primary_hints(state,
			phase2.neighbor_hints ?? FileLib.NeighborHintsLib.create()
		)

		state = FileLib.on_notes_recovered(state, phase2.recovered_notes)
	}

	if (!phase2) {
		expect(FileLib.has_all_infos_for_extracting_the_creation_date(state, {
			require_neighbors_hints: false,
			require_notes: false,
		})).to.be.true

		const bcd_meta = FileLib.get_best_creation_dateⵧfrom_current_data‿meta(state)

	}
	else {
		expect(FileLib.has_all_infos_for_extracting_the_creation_date(state, {
			require_neighbors_hints: true,
			require_notes: true,
		})).to.be.true

		expect(get_best_creation_date__year(state), 'bcy').to.equal(MEDIA.YEAR)
		expect(_get_best_creation_date‿compact(state), 'compact').to.equal(MEDIA.DATE__COMPACT)
		expect(get_embedded_timezone(get_best_creation_date(state)), 'tz').to.deep.equal(MEDIA.FINAL_TZ)
		expect(get_human_readable_timestamp_auto(get_best_creation_date(state), 'tz:embedded'), 'auto').to.deep.equal(MEDIA.DATE__HUMAN_AUTO)
		expect(get_ideal_basename(state), 'ideal basename').to.equal(MEDIA.IDEAL_BASENAME)
	}

	return enforce_immutability(state)
}

// 2018-09-03_20h46m14s506
const MEDIA_DEMO_00_basename = 'exif_date_cn_exif_gps.jpg'
export const MEDIA_DEMO_00: MediaDemo = {
	// expected: 2018-09-03 20:46:14 Asia/Shanghai
	BASENAME: MEDIA_DEMO_00_basename,
	ABS_PATH: path.join(TEST_FILES_DIR_ABS, MEDIA_DEMO_00_basename),

	UTIME_MS: 1535978774000, // MATCHING fs: 2018-09-03_20h46m14 GMT+8
	EXIF_DATA: {
		EMBEDDED_TZ: 'Asia/Shanghai',
		FINAL_TZ: 'Asia/Shanghai',
		YEAR: 2018,
		DATE__COMPACT: 20180903,
		DATE__ISO_STRING: '2018-09-03T20:46:14.506+08:00',
		DATE__HUMAN_AUTO: '2018-09-03_20h46m14s506',
	},

	FINAL_TZ: 'Asia/Shanghai',
	YEAR: 2018,
	DATE__COMPACT: 20180903,
	DATE__HUMAN_AUTO: '2018-09-03_20h46m14s506',
	CONFIDENCE: 'primary',

	IDEAL_BASENAME: 'MM2018-09-03_20h46m14s506_exif_date_cn_exif_gps.jpg',
}
utimes( // ensure expected fs time
	path.join(TEST_FILES_DIR_ABS, MEDIA_DEMO_00.BASENAME),
	MEDIA_DEMO_00.UTIME_MS,
)

// 2002-01-26_16h05m50
const MEDIA_DEMO_01_basename = 'exif_date_fr_alt_no_tz_conflicting_fs.jpg'
export const MEDIA_DEMO_01: MediaDemo = {
	// expected: 2002-01-26 afternoon in Europe
	BASENAME: MEDIA_DEMO_01_basename,
	ABS_PATH: path.join(TEST_FILES_DIR_ABS, MEDIA_DEMO_01_basename),

	UTIME_MS: 1584751060000, // CONFLICTING fs: 2020-03-21_11h37m40 local
	EXIF_DATA: {
		EMBEDDED_TZ: undefined,
		FINAL_TZ: 'Europe/Paris',
		YEAR: 2002,
		DATE__COMPACT: 20020126,
		DATE__ISO_STRING: '2002-01-26T16:05:50.000',
		DATE__HUMAN_AUTO: '2002-01-26_16h05m50',
	},

	FINAL_TZ: 'Europe/Paris',
	YEAR: 2002,
	DATE__COMPACT: 20020126,
	DATE__HUMAN_AUTO: '2002-01-26_16h05m50',
	CONFIDENCE: 'primary',

	IDEAL_BASENAME: 'MM2002-01-26_16h05m50_exif_date_fr_alt_no_tz_conflicting_fs.jpg',
}
utimes( // ensure expected fs time
	path.join(TEST_FILES_DIR_ABS, MEDIA_DEMO_01.BASENAME),
	MEDIA_DEMO_01.UTIME_MS,
)

// 2008-11-14_21h28m32
const MEDIA_DEMO_02_basename = 'exif_date_fr_no_tz_conflicting_fs.jpg'
export const MEDIA_DEMO_02: MediaDemo = {
	// expected: 2008-11-14 evening in Europe
	BASENAME: MEDIA_DEMO_02_basename,
	ABS_PATH: path.join(TEST_FILES_DIR_ABS, MEDIA_DEMO_02_basename),

	UTIME_MS: 1584751060000, // CONFLICTING fs: 2020-03-21_11h37m40 local
	EXIF_DATA: {
		EMBEDDED_TZ: undefined,
		FINAL_TZ: 'Europe/Paris',
		YEAR: 2008,
		DATE__COMPACT: 20081114,
		DATE__ISO_STRING: '2008-11-14T21:28:32.000',
		DATE__HUMAN_AUTO: '2008-11-14_21h28m32',
	},

	FINAL_TZ: 'Europe/Paris',
	YEAR: 2008,
	DATE__COMPACT: 20081114,
	DATE__HUMAN_AUTO: '2008-11-14_21h28m32',
	CONFIDENCE: 'primary',

	IDEAL_BASENAME: 'MM2008-11-14_21h28m32_exif_date_fr_no_tz_conflicting_fs.jpg',
}
utimes( // ensure expected fs time
	path.join(TEST_FILES_DIR_ABS, MEDIA_DEMO_02.BASENAME),
	MEDIA_DEMO_02.UTIME_MS,
)

// 2020-07-28_12h18m21s817
const MEDIA_DEMO_03_basename = 'IMG_7477.heic'
export const MEDIA_DEMO_03: MediaDemo = {
	// expected: 2020 07 28 lunch in Australia
	BASENAME: MEDIA_DEMO_03_basename,
	ABS_PATH: path.join(TEST_FILES_DIR_ABS, MEDIA_DEMO_03_basename),

	UTIME_MS: 1615751060000, // "LOST" fs: GMT: Sunday 14 March 2021 19:44:20
	EXIF_DATA: {
		EMBEDDED_TZ: 'UTC+10',
		FINAL_TZ: 'UTC+10', // TODO recover 'Australia/Sydney' from GPS??
		YEAR: 2020,
		DATE__COMPACT: 20200728,
		DATE__ISO_STRING: '2020-07-28T12:18:21.817+10:00',
		DATE__HUMAN_AUTO: '2020-07-28_12h18m21s817',
	},

	FINAL_TZ: 'UTC+10',
	YEAR: 2020,
	DATE__COMPACT: 20200728,
	DATE__HUMAN_AUTO: '2020-07-28_12h18m21s817',
	CONFIDENCE: 'primary',

	IDEAL_BASENAME: 'MM2020-07-28_12h18m21s817_IMG_7477.heic',
}
utimes( // ensure expected fs time
	path.join(TEST_FILES_DIR_ABS, MEDIA_DEMO_03.BASENAME),
	MEDIA_DEMO_03.UTIME_MS,
)

// 2017-01-24_12h55m17
const MEDIA_DEMO_04_basename = 'IMG_20170124_125515_bad_exif.jpg'
export const MEDIA_DEMO_04: MediaDemo = {
	// example of a bad "CreateDate" EXIF field but we're able to recover from it
	BASENAME: MEDIA_DEMO_04_basename,
	ABS_PATH: path.join(TEST_FILES_DIR_ABS, MEDIA_DEMO_04_basename),

	UTIME_MS: 1535978774000, // "LOST" fs: GMT: Monday 3 September 2018 12:46:14
	EXIF_DATA: {
		EMBEDDED_TZ: 'Asia/Bangkok',
		FINAL_TZ: 'Asia/Bangkok',
		YEAR: 2017,
		DATE__COMPACT: 20170124,
		DATE__ISO_STRING: '2017-01-24T12:55:17.000+07:00',
		DATE__HUMAN_AUTO: '2017-01-24_12h55m17',
	},

	FINAL_TZ: 'Asia/Bangkok',
	YEAR: 2017,
	DATE__COMPACT: 20170124,
	DATE__HUMAN_AUTO: '2017-01-24_12h55m17',
	CONFIDENCE: 'primary',

	IDEAL_BASENAME: 'MM2017-01-24_12h55m17_IMG_bad_exif.jpg',
}
utimes( // ensure expected fs time
	path.join(TEST_FILES_DIR_ABS, MEDIA_DEMO_04.BASENAME),
	MEDIA_DEMO_04.UTIME_MS,
)

// 2020-03-21_11h37m40
const MEDIA_DEMO_05_basename = 'no_exif_date_no_tz.jpg'
export const MEDIA_DEMO_05: MediaDemo = {
	// only source = FS
	BASENAME: MEDIA_DEMO_05_basename,
	ABS_PATH: path.join(TEST_FILES_DIR_ABS, MEDIA_DEMO_05_basename),

	UTIME_MS: 1584751060000, // MATCHING fs: 2020-03-21_11h37m40 local
	EXIF_DATA: {
		EMBEDDED_TZ: undefined,
		FINAL_TZ: undefined,
		YEAR: undefined,
		DATE__COMPACT: undefined,
		DATE__ISO_STRING: undefined,
		DATE__HUMAN_AUTO: undefined,
	},

	// ends being taken from FS
	FINAL_TZ: _UNSAFE_CURRENT_SYSTEM_TIMEZONE,
	YEAR: 2020,
	DATE__COMPACT: 20200321,
	DATE__HUMAN_AUTO: '2020-03-21_11h37m40',
	CONFIDENCE: 'secondary', // undefined reliability = we ~trust fs but not enough for a rename

	IDEAL_BASENAME: MEDIA_DEMO_05_basename, // no change bc no reliable data
}
utimes( // ensure expected fs time
	path.join(TEST_FILES_DIR_ABS, MEDIA_DEMO_05.BASENAME),
	MEDIA_DEMO_05.UTIME_MS,
)

/////////////////////////////////////////////////

export const ALL_MEDIA_DEMOS: Array<{
	data: MediaDemo,
	get_phase1_state: () => ReturnType<typeof load_real_media_file>,
	get_phase2_state: () => ReturnType<typeof load_real_media_file>,
}> = [
	{
		data: MEDIA_DEMO_00,
		// safe to memoize, we enforced immutability ✔
		get_phase1_state: memoize_once(() => _get_demo_state(MEDIA_DEMO_00)),
		get_phase2_state: memoize_once(() => _get_demo_state(MEDIA_DEMO_00, { neighbor_hints: null, recovered_notes: null })),
	},
	{
		data: MEDIA_DEMO_01,
		get_phase1_state: memoize_once(() => _get_demo_state(MEDIA_DEMO_01)),
		get_phase2_state: memoize_once(() => _get_demo_state(MEDIA_DEMO_01, { neighbor_hints: null, recovered_notes: null })),
	},
	{
		data: MEDIA_DEMO_02,
		get_phase1_state: memoize_once(() => _get_demo_state(MEDIA_DEMO_02)),
		get_phase2_state: memoize_once(() => _get_demo_state(MEDIA_DEMO_02, { neighbor_hints: null, recovered_notes: null })),
	},
	{
		data: MEDIA_DEMO_03,
		get_phase1_state: memoize_once(() => _get_demo_state(MEDIA_DEMO_03)),
		get_phase2_state: memoize_once(() => _get_demo_state(MEDIA_DEMO_03, { neighbor_hints: null, recovered_notes: null })),
	},
	{
		data: MEDIA_DEMO_04,
		get_phase1_state: memoize_once(() => _get_demo_state(MEDIA_DEMO_04)),
		get_phase2_state: memoize_once(() => _get_demo_state(MEDIA_DEMO_04, { neighbor_hints: null, recovered_notes: null })),
	},
	{
		data: MEDIA_DEMO_05,
		get_phase1_state: memoize_once(() => _get_demo_state(MEDIA_DEMO_05)),
		get_phase2_state: memoize_once(() => _get_demo_state(MEDIA_DEMO_05, { neighbor_hints: null, recovered_notes: null })),
	},
]
