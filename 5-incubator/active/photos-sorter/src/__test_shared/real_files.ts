import path from 'path'

import memoize_once from 'memoize-one'
import { expect } from 'chai'

import { RelativePath } from '../types'
import { load_real_media_file } from './utils'
import {
	get_best_creation_date,
	get_best_creation_date_compact,
	get_best_creation_year,
	get_ideal_basename,
} from '../state/file'
import { get_embedded_timezone, get_human_readable_timestamp_auto } from '../services/better-date'

const TEST_FILES_DIR: RelativePath = '../../../src/__test_shared'
export const TEST_FILES_DIR_ABS = path.join(__dirname, TEST_FILES_DIR)

export const MEDIA_DEMO_01_basename = 'exif_date_cn_exif_gps.jpg'
const MEDIA_DEMO_01_abs_path = path.join(TEST_FILES_DIR_ABS, MEDIA_DEMO_01_basename)

export const get_MEDIA_DEMO_01 = memoize_once(() => {
	const ↆstate = load_real_media_file(MEDIA_DEMO_01_abs_path)
	ↆstate.then(state => {
		// date: exif data is taken in its local zone
		// expected: 2018-09-03 20:46:14 Asia/Shanghai
		expect(get_best_creation_year(state)).to.equal(2018)
		expect(get_best_creation_date_compact(state)).to.equal(20180903)
		expect(get_embedded_timezone(get_best_creation_date(state))).to.deep.equal('Asia/Shanghai')
		expect(get_human_readable_timestamp_auto(get_best_creation_date(state), 'tz:embedded')).to.deep.equal('2018-09-03_20h46m14s506')
		expect(get_ideal_basename(state)).to.equal(`MM2018-09-03_20h46m14s506_${MEDIA_DEMO_01_basename}`)
	})
	return ↆstate
})

export const MEDIA_DEMO_02_basename = 'exif_date_fr_alt_no_tz_conflicting_fs.jpg'
const MEDIA_DEMO_02_abs_path = path.join(TEST_FILES_DIR_ABS, MEDIA_DEMO_02_basename)

export const get_MEDIA_DEMO_02 = memoize_once(() => {
	const ↆstate = load_real_media_file(MEDIA_DEMO_02_abs_path)
	ↆstate.then(state => {
		// date: exif data is taken in its local zone
		// expected: 2002-01-26 afternoon in Europe
		expect(get_best_creation_year(state)).to.equal(2002)
		expect(get_best_creation_date_compact(state)).to.equal(20020126)
		expect(get_embedded_timezone(get_best_creation_date(state))).to.deep.equal('Europe/Paris')
		expect(get_human_readable_timestamp_auto(get_best_creation_date(state), 'tz:embedded')).to.deep.equal('2002-01-26_16h05m50')
		expect(get_ideal_basename(state)).to.equal(`MM2002-01-26_16h05m50_${MEDIA_DEMO_02_basename}`)
	})
	return ↆstate
})
