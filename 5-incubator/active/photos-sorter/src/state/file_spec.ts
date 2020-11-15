import { expect } from 'chai'
import assert from 'tiny-invariant'
import { Tags, ExifDateTime, exiftool } from 'exiftool-vendored'
import util from 'util'
import path from 'path'
import fs from 'fs'
import hasha from 'hasha'
import moment from 'moment'
import 'moment-timezone'
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
import { get_compact_date, get_human_readable_timestamp_auto } from "../services/date_generator"
import { get_current_timezone } from "../services/params"

/////////////////////

describe(`${LIB} - file state`, function() {

	describe('get_ideal_basename()', function () {

		it('should concatenate the date and meaningful part', () => {
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
			Object.keys(TEST_CASES).forEach(tc => {
				let state = create(tc)
				const creation_date_ms = Number(new Date(2018, 10, 21, 6, 0, 45, 627))

				state = on_fs_stats_read(state, {
					birthtimeMs: creation_date_ms,
					atimeMs: creation_date_ms + 10000,
					mtimeMs: creation_date_ms + 10000,
					ctimeMs: creation_date_ms + 10000,
				} as any)
				state = on_exif_read(state, {} as any)
				state = on_hash_computed(state, '1234')
				expect(get_ideal_basename(state), tc).to.equal(TEST_CASES[tc])
			})
		})
	})

	describe('get_best_creation_date()', function() {
		const default_zone = get_current_timezone()
		const REAL_CREATION_DATE = new Date(2017, 9, 20, 5, 1, 44, 625)
		const REAL_CREATION_DATE_MS = Number(REAL_CREATION_DATE)
		const REAL_CREATION_DATE_RdTS = get_human_readable_timestamp_auto(REAL_CREATION_DATE, default_zone)
		assert(REAL_CREATION_DATE_RdTS.startsWith('2017-10-20'), 'test precond')
		const BAD_CREATION_DATE_CANDIDATE = new Date(2018, 10, 21)
		const BAD_CREATION_DATE_CANDIDATE_MS = Number(BAD_CREATION_DATE_CANDIDATE)
		const BAD_CREATION_DATE_CANDIDATE_ExDT = ExifDateTime
			.fromISO(
				BAD_CREATION_DATE_CANDIDATE.toISOString(),
				default_zone,
				BAD_CREATION_DATE_CANDIDATE.toISOString(),
			)
		const BAD_CREATION_DATE_CANDIDATE_COMPACT = get_compact_date(BAD_CREATION_DATE_CANDIDATE, default_zone)

		it('should always prioritize the basename date', () => {
			let state = create(`foo/MM${REAL_CREATION_DATE_RdTS}.jpg`)

			state = on_fs_stats_read(state, {
				birthtime: BAD_CREATION_DATE_CANDIDATE,
				//atimeMs: BAD_CREATION_DATE_CANDIDATE_MS + 10000,
				//mtimeMs: BAD_CREATION_DATE_CANDIDATE_MS + 10000,
				//ctimeMs: BAD_CREATION_DATE_CANDIDATE_MS + 10000,
			} as Partial<fs.Stats> as any)
			state = on_exif_read(state, {
				'CreateDate': BAD_CREATION_DATE_CANDIDATE_ExDT,
				'DateTimeOriginal': BAD_CREATION_DATE_CANDIDATE_ExDT,
				'DateTimeGenerated': BAD_CREATION_DATE_CANDIDATE_ExDT,
				'MediaCreateDate': BAD_CREATION_DATE_CANDIDATE_ExDT,
			} as Tags)
			state = on_hash_computed(state, '1234')
			expect(get_human_readable_timestamp_auto(get_best_creation_date(state), default_zone)).to.equal(REAL_CREATION_DATE_RdTS)
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
			} as any)
			state = on_exif_read(state, {
				'CreateDate': { toDate: () => BAD_CREATION_DATE_CANDIDATE_MS },
				'DateTimeOriginal': { toDate: () => BAD_CREATION_DATE_CANDIDATE_MS },
				'DateTimeGenerated': { toDate: () => BAD_CREATION_DATE_CANDIDATE_MS },
				'MediaCreateDate': { toDate: () => BAD_CREATION_DATE_CANDIDATE_MS },
			} as any)
			state = on_hash_computed(state, '1234')
			state = on_notes_unpersisted(state, {
				deleted: false,
				original: {
					basename: 'IMG_20171020_050144625.jpg'
				},
			})
			expect(get_best_creation_date(state)).to.equal(REAL_CREATION_DATE_MS)
		})

		context('when no date in current nor original basename', function() {

			it('should prioritise the EXIF data', () => {
				let state = create('foo/bar.jpg')

				state = on_fs_stats_read(state, {
					birthtimeMs: BAD_CREATION_DATE_CANDIDATE_MS,
					atimeMs: BAD_CREATION_DATE_CANDIDATE_MS + 10000,
					mtimeMs: BAD_CREATION_DATE_CANDIDATE_MS + 10000,
					ctimeMs: BAD_CREATION_DATE_CANDIDATE_MS + 10000,
				} as any)
				state = on_exif_read(state, {
					'CreateDate': { toDate: () => BAD_CREATION_DATE_CANDIDATE_MS },
					'DateTimeOriginal': { toDate: () => REAL_CREATION_DATE_MS },
					'DateTimeGenerated': { toDate: () => BAD_CREATION_DATE_CANDIDATE_MS },
					'MediaCreateDate': { toDate: () => BAD_CREATION_DATE_CANDIDATE_MS },
				} as any)
				state = on_hash_computed(state, '1234')
				state = on_notes_unpersisted(state, {
					deleted: false,
					original: {
						basename: 'bar.jpg'
					},
				})
				expect(get_ideal_basename(state)).to.equal('MM2017-10-20_05h01m44s625.jpg')
			})

			context('when no EXIF date', function () {

				it('should use fs stats')

				it('should cross check with the parent hint if any', () => {
					let state = create('20171020 - holidays/foo.jpg')

					state = on_fs_stats_read(state, {
						birthtimeMs: BAD_CREATION_DATE_CANDIDATE_MS,
						atimeMs: BAD_CREATION_DATE_CANDIDATE_MS + 10000,
						mtimeMs: BAD_CREATION_DATE_CANDIDATE_MS + 10000,
						ctimeMs: BAD_CREATION_DATE_CANDIDATE_MS + 10000,
					} as any)
					state = on_exif_read(state, {
						'CreateDate': { toDate: () => BAD_CREATION_DATE_CANDIDATE_MS },
						'DateTimeOriginal': { toDate: () => BAD_CREATION_DATE_CANDIDATE_MS },
						'DateTimeGenerated': { toDate: () => BAD_CREATION_DATE_CANDIDATE_MS },
						'MediaCreateDate': { toDate: () => BAD_CREATION_DATE_CANDIDATE_MS },
					} as any)
					state = on_hash_computed(state, '1234')
					/*state = on_notes_unpersisted(state, {
						deleted: false,
						original: {
							basename: 'IMG_20171020_050144625.jpg'
						},
					})*/
					expect(get_ideal_basename(state)).to.equal('MM2017-10-20_05h01m44s625.jpg')
				})
			})
		})
	})

	describe('integration', function() {

		describe('real files', function() {
			const TEST_FILES_DIR = '../../../src/__test_shared'

			async function load(state: Immutable<State>, abs_path: string): Promise<Immutable<State>> {
				expect(is_media_file(state)).to.be.true
				expect(is_exif_powered_media_file(state)).to.be.true

				await Promise.all([
					hasha.fromFile(abs_path, {algorithm: 'sha256'})
						.then(hash => {
							expect(has_all_infos_for_extracting_the_creation_date(state)).to.be.false
							assert(hash)
							state = on_hash_computed(state, hash)
						}),
					util.promisify(fs.stat)(abs_path)
						.then(stats => {
							expect(has_all_infos_for_extracting_the_creation_date(state)).to.be.false
							state = on_fs_stats_read(state, stats)
						}),
					exiftool.read(abs_path)
						.then(exif_data => {
							expect(has_all_infos_for_extracting_the_creation_date(state)).to.be.false
							state = on_exif_read(state, exif_data)
						})
				])

				expect(has_all_infos_for_extracting_the_creation_date(state)).to.be.true

				return state
			}

			const BN01 = 'exif_date_cn_exif_gps.jpg'
			it('should work - ' + BN01, async () => {
				const basename = BN01
				const abs_path = path.join(__dirname, TEST_FILES_DIR, basename)
				let state = create(basename)
				/*console.log({
					basename,
					abs_path,
					state,
				})*/
				expect(get_current_basename(state)).to.equal(basename)
				expect(get_current_parent_folder_id(state)).to.equal('.')

				state = await load(state, abs_path)
				//console.log(state)

				// date: exif data is taken in its local zone
				const expected_moment = moment.tz("2018-09-03 20:46:14", 'Asia/Shanghai')
				const expected_date = expected_moment.toDate()
				expect(get_best_creation_year(state)).to.equal(2018)
				expect(get_best_creation_date_compact(state)).to.equal(20180903)
				expect(get_best_creation_date(state)).to.deep.equal(expected_date)
				expect(get_ideal_basename(state)).to.equal(`MM2018-09-03_20h46m14_${basename}`)
			})

			const BN02 = 'exif_date_fr_alt_no_tz_conflicting_fs.jpg'
			it('should work - ' + BN02, async () => {
				const basename = BN02
				const abs_path = path.join(__dirname, TEST_FILES_DIR, basename)
				let state = create(basename)
				/*console.log({
					basename,
					abs_path,
					state,
				})*/
				expect(get_current_basename(state)).to.equal(basename)
				expect(get_current_parent_folder_id(state)).to.equal('.')

				state = await load(state, abs_path)
				//console.log(state)

				// date: exif data is taken in its local zone
				expect(get_best_creation_year(state)).to.equal(2002)
				expect(get_best_creation_date_compact(state)).to.equal(20020126)
				expect(get_best_creation_date(state)).to.deep.equal(new Date(2002, 0, 26, 16, 5, 50))
				expect(get_ideal_basename(state)).to.equal(`MM2002-01-26_16h05m50_${basename}`)
			})
		})
	})
})
