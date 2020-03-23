import { expect } from 'chai'
import assert from 'tiny-invariant'

import { LIB } from '../consts'
import {
	State,
	create,
	get_ideal_basename,
	get_best_creation_date,
	on_fs_stats_read,
	on_exif_read,
	on_hash_computed, on_notes_unpersisted,
} from './file'
import logger from "../services/logger";
import {get_compact_date, get_human_readable_timestamp_auto} from "../services/date_generator";

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
				let state: State = create(tc)
				const creation_date_ms = 1542780045627

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
		const REAL_CREATION_DATE_MS = 1508475704625 // 2017-10-20_05h01m44s625
		const REAL_DATE = new Date(REAL_CREATION_DATE_MS)
		const EXPECTED_HUMAN_READABLE_TS = get_human_readable_timestamp_auto(REAL_DATE)
		assert(EXPECTED_HUMAN_READABLE_TS.startsWith('2017-10-20'), 'test pre')
		const BAD_CREATION_DATE_CANDIDATE_MS = 1542780045627 // 20181121
		const BAD_CREATION_DATE_CANDIDATE_COMPACT = get_compact_date(new Date(BAD_CREATION_DATE_CANDIDATE_MS))

		it('should always prioritize the basename date', () => {
			let state: State = create(`foo/MM${EXPECTED_HUMAN_READABLE_TS}.jpg`)

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
			expect(get_best_creation_date(state)).to.equal(REAL_CREATION_DATE_MS)
		})

		it('should prioritize the original basename over the current one', () => {
			let state: State = create(
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
				let state: State = create('foo/bar.jpg')

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
					let state: State = create('20171020 - holidays/foo.jpg')

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
})
