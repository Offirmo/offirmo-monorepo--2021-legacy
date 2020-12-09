import { expect } from 'chai'
import assert from 'tiny-invariant'
import { Tags, exiftool } from 'exiftool-vendored'
import util from 'util'
import path from 'path'
import fs from 'fs'
import hasha from 'hasha'

import { Immutable } from '@offirmo-private/ts-types'

import { LIB } from '../consts'
import {
	State,
	create,

	get_ideal_basename,
	get_best_creation_date,
	get_current_parent_folder_id,
	get_current_basename,
	is_media_file,
	is_exif_powered_media_file,
	has_all_infos_for_extracting_the_creation_date,
	get_best_creation_date_compact,

	on_fs_stats_read,
	on_exif_read,
	on_hash_computed, on_notes_unpersisted, get_best_creation_year,
} from './file'
import {
	get_timestamp_utc_ms_from,
	get_compact_date,
	get_human_readable_timestamp_auto,
	get_embedded_timezone,
	create_better_date, get_exif_datetime,
} from '../services/better-date'
import {
	MEDIA_DEMO_01_basename,
	get_MEDIA_DEMO_01,
	MEDIA_DEMO_02_basename,
	get_MEDIA_DEMO_02,
} from '../__test_shared/real_files'

/////////////////////

describe(`${LIB} - file state`, function() {

	describe('get_ideal_basename()', function () {

		type TCIdeal = { [k: string]: string }
		const TEST_CASES: TCIdeal = {
			// no date in basename
			'P1000010.JPG': 'MM2018-11-21_06h00m45s627_P1000010.jpg',
			'IMG_3211.JPG': 'MM2018-11-21_06h00m45s627_IMG_3211.jpg',
			'TR81801414546EGJ.jpg': 'MM2018-11-21_06h00m45s627_TR81801414546EGJ.jpg', // lot of digits but not a date
			// basename has date, takes precedence
			'IMG_20130525.JPG': 'MM2013-05-25.jpg',
			'IMG_20181121.PNG': 'MM2018-11-21_06h00m45s627.png', // fs increases precision since compatible with file date
			'20180603_taronga_vivd.gif': 'MM2018-06-03_taronga_vivd.gif',
			'MM2017-10-20_05h01m44s625.jpg': 'MM2017-10-20_05h01m44s625.jpg',
		}
		Object.keys(TEST_CASES).forEach(tc_key => {
			it(`should concatenate the date and meaningful part - "${tc_key}"`, () => {
				let state = create(tc_key)
				const creation_date_ms = get_timestamp_utc_ms_from(create_better_date('tz:auto', 2018, 11, 21, 6, 0, 45, 627))

				state = on_fs_stats_read(state, {
					birthtimeMs: creation_date_ms,
					atimeMs: creation_date_ms + 10000,
					mtimeMs: creation_date_ms + 10000,
					ctimeMs: creation_date_ms + 10000,
				} as Partial<fs.Stats> as any)
				state = on_exif_read(state, {} as any)
				state = on_hash_computed(state, '1234')
				state = on_notes_unpersisted(state, null)
				expect(get_ideal_basename(state), tc_key).to.equal(TEST_CASES[tc_key])
			})
		})
	})

	describe('get_best_creation_date()', function() {
		const REAL_CREATION_DATE = create_better_date('tz:auto', 2017, 10, 20, 5, 1, 44, 625)
		const REAL_CREATION_DATE_MS = get_timestamp_utc_ms_from(REAL_CREATION_DATE)
		const REAL_CREATION_DATE_LEGACY = new Date(REAL_CREATION_DATE_MS)
		const REAL_CREATION_DATE_EXIF = get_exif_datetime(REAL_CREATION_DATE)
		const REAL_CREATION_DATE_RdTS = get_human_readable_timestamp_auto(REAL_CREATION_DATE, 'tz:embedded')
		assert(REAL_CREATION_DATE_RdTS.startsWith('2017-10-20'), 'test precond')

		// must be OLDER yet we won't pick it
		const BAD_CREATION_DATE_CANDIDATE = create_better_date('tz:auto', 2016, 11, 21)
		const BAD_CREATION_DATE_CANDIDATE_MS = get_timestamp_utc_ms_from(BAD_CREATION_DATE_CANDIDATE)
		const BAD_CREATION_DATE_CANDIDATE_LEGACY = new Date(BAD_CREATION_DATE_CANDIDATE_MS)
		const BAD_CREATION_DATE_CANDIDATE_EXIF = get_exif_datetime(BAD_CREATION_DATE_CANDIDATE)
		const BAD_CREATION_DATE_CANDIDATE_COMPACT = get_compact_date(BAD_CREATION_DATE_CANDIDATE, 'tz:embedded')

		it('should always prioritize the basename date', () => {
			let state = create(`foo/MM${REAL_CREATION_DATE_RdTS}.jpg`)

			state = on_fs_stats_read(state, {
				birthtimeMs: BAD_CREATION_DATE_CANDIDATE_MS,
				atimeMs:     BAD_CREATION_DATE_CANDIDATE_MS + 10000,
				mtimeMs:     BAD_CREATION_DATE_CANDIDATE_MS + 10000,
				ctimeMs:     BAD_CREATION_DATE_CANDIDATE_MS + 10000,
			} as Partial<fs.Stats> as any)
			state = on_exif_read(state, {
				'CreateDate':        BAD_CREATION_DATE_CANDIDATE_EXIF,
				'DateTimeOriginal':  BAD_CREATION_DATE_CANDIDATE_EXIF,
				'DateTimeGenerated': BAD_CREATION_DATE_CANDIDATE_EXIF,
				'MediaCreateDate':   BAD_CREATION_DATE_CANDIDATE_EXIF,
			} as Tags)
			state = on_hash_computed(state, '1234')
			state = on_notes_unpersisted(state, null)
			expect(get_human_readable_timestamp_auto(get_best_creation_date(state), 'tz:embedded'), 'tz:embedded').to.equal(REAL_CREATION_DATE_RdTS)
		})

		it('should prioritize the original basename over the current one', () => {
			let state = create(
				`2000/${BAD_CREATION_DATE_CANDIDATE_COMPACT}/MM${BAD_CREATION_DATE_CANDIDATE_COMPACT}_09h08m07s006.jpg`
			)

			state = on_fs_stats_read(state, {
				birthtimeMs: BAD_CREATION_DATE_CANDIDATE_MS,
				atimeMs: BAD_CREATION_DATE_CANDIDATE_MS + 10000,
				mtimeMs: BAD_CREATION_DATE_CANDIDATE_MS + 10000,
				ctimeMs: BAD_CREATION_DATE_CANDIDATE_MS + 10000,
			} as Partial<fs.Stats> as any)
			state = on_exif_read(state, {
				'CreateDate':        BAD_CREATION_DATE_CANDIDATE_EXIF,
				'DateTimeOriginal':  BAD_CREATION_DATE_CANDIDATE_EXIF,
				'DateTimeGenerated': BAD_CREATION_DATE_CANDIDATE_EXIF,
				'MediaCreateDate':   BAD_CREATION_DATE_CANDIDATE_EXIF,
			} as Partial<Tags> as any)
			state = on_hash_computed(state, '1234')
			state = on_notes_unpersisted(state, {
				deleted: false,
				starred: false,
				original: {
					basename: 'IMG_20171020_050144625.jpg',
				},
			})

			expect(get_best_creation_date(state)).to.deep.equal(REAL_CREATION_DATE)
		})

		context('when no date in current nor original basename', function() {

			it('should prioritise the EXIF data', () => {
				let state = create('foo/bar.jpg')

				state = on_fs_stats_read(state, {
					birthtimeMs: BAD_CREATION_DATE_CANDIDATE_MS,
					atimeMs:     BAD_CREATION_DATE_CANDIDATE_MS + 10000,
					mtimeMs:     BAD_CREATION_DATE_CANDIDATE_MS + 10000,
					ctimeMs:     BAD_CREATION_DATE_CANDIDATE_MS + 10000,
				} as Partial<fs.Stats> as any)
				state = on_exif_read(state, {
					'CreateDate':        REAL_CREATION_DATE_EXIF,
					'DateTimeOriginal':  REAL_CREATION_DATE_EXIF,
					'DateTimeGenerated': REAL_CREATION_DATE_EXIF,
					'MediaCreateDate':   REAL_CREATION_DATE_EXIF,
				} as Partial<Tags> as any)
				state = on_hash_computed(state, '1234')
				state = on_notes_unpersisted(state, {
					deleted: false,
					starred: false,
					original: {
						basename: 'bar.jpg'
					},
				})
				//console.log({ REAL_CREATION_DATE_RdTS })
				expect(get_ideal_basename(state)).to.equal('MM2017-10-20_05h01m44s625_bar.jpg')
			})

			context('when no EXIF date', function () {

				it('should use fs stats', () => {
					let state = create('foo/bar.jpg')

					state = on_fs_stats_read(state, {
						birthtimeMs: REAL_CREATION_DATE_MS,
						atimeMs:     REAL_CREATION_DATE_MS + 10000,
						mtimeMs:     REAL_CREATION_DATE_MS + 10000,
						ctimeMs:     REAL_CREATION_DATE_MS + 10000,
					} as Partial<fs.Stats> as any)
					state = on_exif_read(state, {} as Partial<Tags> as any)
					state = on_hash_computed(state, '1234')
					state = on_notes_unpersisted(state, null)
					expect(get_ideal_basename(state)).to.equal('MM2017-10-20_05h01m44s625_bar.jpg')
				})

				it('should cross check with the parent hint if any', () => {
					let state = create('20171020 - holidays/foo.jpg')

					state = on_fs_stats_read(state, {
						birthtimeMs: BAD_CREATION_DATE_CANDIDATE_MS,
						atimeMs:     BAD_CREATION_DATE_CANDIDATE_MS + 10000,
						mtimeMs:     BAD_CREATION_DATE_CANDIDATE_MS + 10000,
						ctimeMs:     BAD_CREATION_DATE_CANDIDATE_MS + 10000,
					} as Partial <fs.Stats> as any)
					state = on_exif_read(state, {} as Partial<Tags> as any)
					state = on_hash_computed(state, '1234')
					state = on_notes_unpersisted(state, null)
					/*state = on_notes_unpersisted(state, {
						deleted: false,
						original: {
							basename: 'IMG_20171020_050144625.jpg'
						},
					})*/
					expect(() => get_ideal_basename(state)).to.throw('Too big discrepancy')
				})
			})
		})
	})

	describe('integration', function() {

		describe('real files', function() {
			//this.timeout(5000)

			it('should work - ' + MEDIA_DEMO_01_basename, async () => {
				const basename = MEDIA_DEMO_01_basename
				let state = await get_MEDIA_DEMO_01()

				expect(get_current_basename(state)).to.equal(basename)
				expect(get_current_parent_folder_id(state)).to.equal('.')

				// date: exif data is taken in its local zone
				// expected: 2018-09-03 20:46:14 Asia/Shanghai
				expect(get_best_creation_year(state)).to.equal(2018)
				expect(get_best_creation_date_compact(state)).to.equal(20180903)
				expect(get_embedded_timezone(get_best_creation_date(state))).to.deep.equal('Asia/Shanghai')
				expect(get_human_readable_timestamp_auto(get_best_creation_date(state), 'tz:embedded')).to.deep.equal('2018-09-03_20h46m14s506')
				expect(get_ideal_basename(state)).to.equal(`MM2018-09-03_20h46m14s506_${basename}`)
			})

			it('should work - ' + MEDIA_DEMO_02_basename, async () => {
				const basename = MEDIA_DEMO_02_basename
				let state = await get_MEDIA_DEMO_02()

				expect(get_current_basename(state)).to.equal(basename)
				expect(get_current_parent_folder_id(state)).to.equal('.')

				// date: exif data is taken in its local zone
				// expected: 2002-01-26 afternoon in Europe
				expect(get_best_creation_year(state)).to.equal(2002)
				expect(get_best_creation_date_compact(state)).to.equal(20020126)
				expect(get_embedded_timezone(get_best_creation_date(state))).to.deep.equal('Europe/Paris')
				expect(get_human_readable_timestamp_auto(get_best_creation_date(state), 'tz:embedded')).to.deep.equal('2002-01-26_16h05m50')
				expect(get_ideal_basename(state)).to.equal(`MM2002-01-26_16h05m50_${basename}`)
			})
		})
	})
})
