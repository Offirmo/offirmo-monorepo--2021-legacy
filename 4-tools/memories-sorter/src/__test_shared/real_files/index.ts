import path from 'path'

import memoize_once from 'memoize-one'
import { Immutable } from '@offirmo-private/ts-types'
import { expect } from 'chai'
import { enforce_immutability } from '@offirmo-private/state-utils'

import { AbsolutePath, Basename, SimpleYYYYMMDD, ISODateString, RelativePath, TimeZone } from '../../types'
import { _UNSAFE_CURRENT_SYSTEM_TIMEZONE } from '../../params'
import { load_real_media_file } from '../utils'
import {
	State,
	get_best_creation_date,
	get_best_creation_date_compact,
	get_best_creation_year,
	get_ideal_basename,
	DateConfidence, NeighborHints, PersistedNotes,
} from '../../state/file'
import {
	get_embedded_timezone,
	get_human_readable_timestamp_auto,
} from '../../services/better-date'

/////////////////////////////////////////////////

const TEST_FILES_DIR: RelativePath = '../../../../src/__test_shared/real_files'
export const TEST_FILES_DIR_ABS = path.join(__dirname, TEST_FILES_DIR)

interface MediaDemo {
	BASENAME: Basename
	ABS_PATH: AbsolutePath

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

async function _get_demo_state(
	MEDIA: MediaDemo,
	phase2?: null | {
		neighbor_hints?: null | Immutable<NeighborHints>
		recovered_notes?: null | Immutable<PersistedNotes>
	}
): Promise<Immutable<State>> {
	const ↆstate = load_real_media_file(MEDIA.ABS_PATH, phase2)
	ↆstate.then(state => {
		expect(get_best_creation_year(state)).to.equal(MEDIA.YEAR)
		expect(get_best_creation_date_compact(state)).to.equal(MEDIA.DATE__COMPACT)
		expect(get_embedded_timezone(get_best_creation_date(state))).to.deep.equal(MEDIA.FINAL_TZ)
		expect(get_human_readable_timestamp_auto(get_best_creation_date(state), 'tz:embedded')).to.deep.equal(MEDIA.DATE__HUMAN_AUTO)
		expect(get_ideal_basename(state)).to.equal(MEDIA.IDEAL_BASENAME)
	})
	return ↆstate
}

const MEDIA_DEMO_01_basename = 'exif_date_cn_exif_gps.jpg'
export const MEDIA_DEMO_01: MediaDemo = {
	// expected: 2018-09-03 20:46:14 Asia/Shanghai
	BASENAME: MEDIA_DEMO_01_basename,
	ABS_PATH: path.join(TEST_FILES_DIR_ABS, MEDIA_DEMO_01_basename),

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

const MEDIA_DEMO_02_basename = 'exif_date_fr_alt_no_tz_conflicting_fs.jpg'
export const MEDIA_DEMO_02: MediaDemo = {
	// expected: 2002-01-26 afternoon in Europe
	BASENAME: MEDIA_DEMO_02_basename,
	ABS_PATH: path.join(TEST_FILES_DIR_ABS, MEDIA_DEMO_02_basename),

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

const MEDIA_DEMO_03_basename = 'exif_date_fr_no_tz_conflicting_fs.jpg'
export const MEDIA_DEMO_03: MediaDemo = {
	// expected: 2008-11-14 evening in Europe
	BASENAME: MEDIA_DEMO_03_basename,
	ABS_PATH: path.join(TEST_FILES_DIR_ABS, MEDIA_DEMO_03_basename),

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

const MEDIA_DEMO_04_basename = 'IMG_7477.heic'
export const MEDIA_DEMO_04: MediaDemo = {
	// expected: 2020 07 28 lunch in Australia
	BASENAME: MEDIA_DEMO_04_basename,
	ABS_PATH: path.join(TEST_FILES_DIR_ABS, MEDIA_DEMO_04_basename),

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

const MEDIA_DEMO_05_basename = 'IMG_20170124_125515_bad_exif.jpg'
export const MEDIA_DEMO_05: MediaDemo = {
	// example of a bad "CreateDate" EXIF field but we're able to recover from it
	BASENAME: MEDIA_DEMO_05_basename,
	ABS_PATH: path.join(TEST_FILES_DIR_ABS, MEDIA_DEMO_05_basename),

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

const MEDIA_DEMO_06_basename = 'no_exif_date_no_tz.jpg'
export const MEDIA_DEMO_06: MediaDemo = {
	// only source = FS
	BASENAME: MEDIA_DEMO_06_basename,
	ABS_PATH: path.join(TEST_FILES_DIR_ABS, MEDIA_DEMO_06_basename),

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
	CONFIDENCE: 'junk', // undefined reliability = we ~trust fs but not enough for a rename

	IDEAL_BASENAME: MEDIA_DEMO_06_basename, // no change bc no reliable data
}

// TODO add the horrible whatsapp video

/////////////////////////////////////////////////

export const ALL_MEDIA_DEMOS: Array<{ data: MediaDemo, get_phase1_state: () => ReturnType<typeof load_real_media_file>}> = [
	{
		data: MEDIA_DEMO_01,
		get_phase1_state: memoize_once(() => _get_demo_state(MEDIA_DEMO_01)),
	},
	{
		data: MEDIA_DEMO_02,
		get_phase1_state: memoize_once(() => _get_demo_state(MEDIA_DEMO_02)),
	},
	{
		data: MEDIA_DEMO_03,
		get_phase1_state: memoize_once(() => _get_demo_state(MEDIA_DEMO_03)),
	},
	{
		data: MEDIA_DEMO_04,
		get_phase1_state: memoize_once(() => _get_demo_state(MEDIA_DEMO_04)),
	},
	{
		data: MEDIA_DEMO_05,
		get_phase1_state: memoize_once(() => _get_demo_state(MEDIA_DEMO_05)),
	},
	{
		data: MEDIA_DEMO_06,
		get_phase1_state: memoize_once(() => _get_demo_state(MEDIA_DEMO_06)),
	},
]
