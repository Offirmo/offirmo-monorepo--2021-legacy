import path from 'path'
const { deepStrictEqual: assert_deepStrictEqual } = require('assert').strict
import { expect } from 'chai'
import assert from 'tiny-invariant'
import { Tags } from 'exiftool-vendored'

import { Immutable } from '@offirmo-private/ts-types'
import { get_json_difference, enforce_immutability } from '@offirmo-private/state-utils'

import { LIB } from '../consts'
import {
	State,
	create,

	get_ideal_basename,
	get_best_creation_date,
	get_current_parent_folder_id,
	get_current_basename,
	get_best_creation_date_meta,
	is_media_file,
	is_exif_powered_media_file,
	has_all_infos_for_extracting_the_creation_date,
	get_best_creation_date_compact,
	merge_duplicates,

	on_fs_stats_read,
	on_exif_read,
	on_hash_computed,
	on_notes_recovered,
	get_best_creation_year,
	on_neighbors_hints_collected,
	FileId,
	PersistedNotes,
} from './file'
import {
	get_timestamp_utc_ms_from,
	get_compact_date,
	get_human_readable_timestamp_auto,
	get_embedded_timezone,
	create_better_date, get_exif_datetime,
	assertㆍbetter_dateㆍdeepㆍequal,
} from '../services/better-date'
import { ALL_MEDIA_DEMOS } from '../__test_shared/real_files'
import { SimpleYYYYMMDD } from '../types'

/////////////////////

describe(`${LIB} - file (state)`, function() {
	const CREATION_DATE         = create_better_date('tz:auto', 2017, 10, 20, 5, 1, 44, 625)
	const EARLIER_CREATION_DATE = create_better_date('tz:auto', 2017, 10, 18, 5, 1, 44, 625)

	function create_demo(id: FileId = 'foo/bar.jpg', time = CREATION_DATE): Immutable<State> {
		let state = create(id)

		state = on_fs_stats_read(state, {
			birthtimeMs: get_timestamp_utc_ms_from(time),
			atimeMs:     get_timestamp_utc_ms_from(time),
			mtimeMs:     get_timestamp_utc_ms_from(time),
			ctimeMs:     get_timestamp_utc_ms_from(time),
		})
		if (is_exif_powered_media_file(state)) {
			state = on_exif_read(state, {
				SourceFile: id,
				CreateDate: get_exif_datetime(time),
			} as Tags)
		}
		state = on_hash_computed(state, '1234')

		// yes, real case = since having the same hash,
		// all the files will have the same notes.
		state = on_notes_recovered(state, {
			currently_known_as: 'whatever, will be replaced.jpg',
			renaming_source: undefined,

			starred: undefined,
			deleted: undefined,
			manual_date: undefined,

			original: {
				basename: 'original.jpg',
				parent_path: 'foo',
				fs_birthtime_ms: get_timestamp_utc_ms_from(EARLIER_CREATION_DATE),
				is_fs_birthtime_assessed_reliable: false,
			}
		})
		state = on_neighbors_hints_collected(state, null, undefined)

		expect(state.notes.currently_known_as, 'currently_known_as').to.equal(path.parse(id).base)

		return enforce_immutability(state)
	}

	function expectㆍfileㆍstatesㆍdeepㆍequal(s1: Immutable<State>, s2: Immutable<State>, should_log = true): void {
		const s1_alt = {
			...s1,
			memoized: null
		}
		const s2_alt = {
			...s2,
			memoized: null
		}

		try {
			assert_deepStrictEqual(s1_alt, s2_alt)
		}
		catch (err) {
			if (should_log)
				console.error('expectㆍfileㆍstatesㆍdeepㆍequal() FALSE', get_json_difference(s1_alt, s2_alt))
			throw err
		}
	}
	function expectㆍfileㆍstatesㆍNOTㆍdeepㆍequal(s1: Immutable<State>, s2: Immutable<State>): void {
		try {
			expectㆍfileㆍstatesㆍdeepㆍequal(s1, s2, false)
		}
		catch (err) {
			if (err.message.includes('Expected values to be strictly deep-equal'))
				return

			throw err
		}
	}


	describe('get_best_creation_date()', function() {
		const REAL_CREATION_DATE = create_better_date('tz:auto', 2017, 10, 20, 5, 1, 44, 625)
		const REAL_CREATION_DATE_MS = get_timestamp_utc_ms_from(REAL_CREATION_DATE)
		const REAL_CREATION_DATE_LEGACY = new Date(REAL_CREATION_DATE_MS)
		const REAL_CREATION_DATE_EXIF = get_exif_datetime(REAL_CREATION_DATE)
		const REAL_CREATION_DATE_RdTS = get_human_readable_timestamp_auto(REAL_CREATION_DATE, 'tz:embedded')
		assert(REAL_CREATION_DATE_RdTS.startsWith('2017-10-20'), 'test precond')

		// must be OLDER yet we won't pick it
		const BAD_CREATION_DATE_CANDIDATE = create_better_date('tz:auto', 2016, 11, 21, 9, 8, 7, 654)
		const BAD_CREATION_DATE_CANDIDATE_MS = get_timestamp_utc_ms_from(BAD_CREATION_DATE_CANDIDATE)
		const BAD_CREATION_DATE_CANDIDATE_LEGACY = new Date(BAD_CREATION_DATE_CANDIDATE_MS)
		const BAD_CREATION_DATE_CANDIDATE_EXIF = get_exif_datetime(BAD_CREATION_DATE_CANDIDATE)
		const BAD_CREATION_DATE_CANDIDATE_RdTS = get_human_readable_timestamp_auto(BAD_CREATION_DATE_CANDIDATE, 'tz:embedded')
		const BAD_CREATION_DATE_CANDIDATE_COMPACT = get_compact_date(BAD_CREATION_DATE_CANDIDATE, 'tz:embedded')

		// everything bad / undated by default, so that the tests must override those
		let parent_folder_name__current = 'foo'
		let file_basename__current = 'bar.jpg'
		let date__fs_ms__current = BAD_CREATION_DATE_CANDIDATE_MS // always exist
		let parent_folder_name__original = parent_folder_name__current
		let file_basename__original = file_basename__current
		let date__fs_ms__original = date__fs_ms__current // always exist
		let date__exif: null | typeof REAL_CREATION_DATE_EXIF = BAD_CREATION_DATE_CANDIDATE_EXIF
		let notes: null | 'auto' | Immutable<PersistedNotes> = null
		let hints_from_reliable_neighbors__current__range: null | [ SimpleYYYYMMDD, SimpleYYYYMMDD ] = null
		let hints_from_reliable_neighbors__current__fs_reliability: undefined | boolean = undefined
		beforeEach(() => {
			parent_folder_name__current = 'foo'
			file_basename__current = 'bar.jpg'
			date__fs_ms__current = BAD_CREATION_DATE_CANDIDATE_MS
			parent_folder_name__original = parent_folder_name__current
			file_basename__original = file_basename__current
			date__fs_ms__original = date__fs_ms__current // always exist
			date__exif = BAD_CREATION_DATE_CANDIDATE_EXIF
			notes = null
			hints_from_reliable_neighbors__current__range = null
			hints_from_reliable_neighbors__current__fs_reliability = undefined
		})
		function create_test_file_state(): Immutable<State> {
			/*console.log({
parent_folder_name__original,
parent_folder_name__current,
file_basename__original,
file_basename__current,
date__fs_ms__original,
date__fs_ms__current,
date__exif,
notes,
hints_from_reliable_neighbors__current: hints_from_reliable_neighbors__current__range,
})*/

			const id = path.join(parent_folder_name__current, file_basename__current)
			let state = create(id)

			state = on_fs_stats_read(state, {
				birthtimeMs: date__fs_ms__current,
				atimeMs:     date__fs_ms__current + 10000,
				mtimeMs:     date__fs_ms__current + 10000,
				ctimeMs:     date__fs_ms__current + 10000,
			})
			if (is_exif_powered_media_file(state)) {
				state = on_exif_read(state, {
					SourceFile: id,
					...(date__exif && {
						// may be exif powered without the info we need
						'CreateDate':        date__exif,
						'DateTimeOriginal':  date__exif,
						'DateTimeGenerated': date__exif,
						'MediaCreateDate':   date__exif,
					})
				} as Partial<Tags> as any)
			}
			state = on_hash_computed(state, '1234')
			if (notes === 'auto') {
				notes = {
					currently_known_as: file_basename__current,
					renaming_source: undefined,

					deleted: false,
					starred: false,
					manual_date: undefined,

					original: {
						basename: file_basename__original,
						parent_path: parent_folder_name__original,
						fs_birthtime_ms: date__fs_ms__original,
						is_fs_birthtime_assessed_reliable: false,
					},
				}
			}

			state = on_notes_recovered(state, notes)
			state = on_neighbors_hints_collected(state, hints_from_reliable_neighbors__current__range, hints_from_reliable_neighbors__current__fs_reliability)

			return state
		}

		context('when encountering the file for the 1st time == NOT having notes incl. original data', function() {

			// not possible, stupid
			//describe('when having a manual date'

			context('when having an EXIF date', function() {
				beforeEach(() => {
					date__exif = REAL_CREATION_DATE_EXIF
				})

				it('should be prioritized as a primary source', () => {
					let state = create_test_file_state()

					const bcdm = get_best_creation_date_meta(state)
					expect(bcdm.source, 'source').to.equal('exif')
					expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal('2017-10-20_05h01m44s625')
					expect(bcdm.confidence, 'confidence').to.equal('primary')
					expect(bcdm.is_fs_matching, 'fs matching').to.be.false

					// final as integration
					expect(get_ideal_basename(state), 'ideal basename').to.equal('MM2017-10-20_05h01m44s625_bar.jpg')
				})
			})

			context('when NOT having EXIF date', function() {
				beforeEach(() => {
					date__exif = null
				})

				context('when having a date in the basename', function() {

					context('when this basename is NOT normalized', function() {
						beforeEach(() => {
							file_basename__current = 'IMG_20171020_0501.jpg'
						})

						context('when having a matching FS date', function() {
							beforeEach(() => {
								date__fs_ms__current = REAL_CREATION_DATE_MS
							})

							it('should use the basename and enrich it with fs, as primary', () => {
								let state = create_test_file_state()

								const bcdm = get_best_creation_date_meta(state)
								expect(bcdm.source, 'source').to.equal('some_basename_nn+fs')
								expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal('2017-10-20_05h01m44s625')
								expect(bcdm.confidence, 'confidence').to.equal('primary')
								expect(bcdm.is_fs_matching, 'fs matching').to.be.true

								// final as integration
								expect(get_ideal_basename(state), 'ideal basename').to.equal('MM2017-10-20_05h01m44s625.jpg')
							})
						})

						context('when NOT having a matching FS date', function() {
							beforeEach(() => {
								date__fs_ms__current = BAD_CREATION_DATE_CANDIDATE_MS
							})

							it('should use the basename only as primary WITHOUT using fs', () => {
								let state = create_test_file_state()

								const bcdm = get_best_creation_date_meta(state)
								expect(bcdm.source, 'source').to.equal('some_basename_nn')
								expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal('2017-10-20_05h01')
								expect(bcdm.confidence, 'confidence').to.equal('primary')
								expect(bcdm.is_fs_matching, 'fs matching').to.be.false

								// final as integration
								expect(get_ideal_basename(state), 'ideal basename').to.equal('MM2017-10-20_05h01.jpg')
							})
						})
					})

					context('when this basename is normalized', function() {
						beforeEach(() => {
							file_basename__current = `MM${REAL_CREATION_DATE_RdTS}_hello.jpg`
						})

						context('when NOT having a matching FS date', function() {
							beforeEach(() => {
								date__fs_ms__current = BAD_CREATION_DATE_CANDIDATE_MS
							})

							it('should trust the previous run as primary and ignore FS', () => {
								let state = create_test_file_state()

								const bcdm = get_best_creation_date_meta(state)
								expect(bcdm.source, 'source').to.equal('some_basename_normalized')
								expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal('2017-10-20_05h01m44s625')
								expect(bcdm.confidence, 'confidence').to.equal('primary')
								expect(bcdm.is_fs_matching, 'fs matching').to.be.false

								// final as integration
								expect(get_ideal_basename(state), 'ideal basename').to.equal('MM2017-10-20_05h01m44s625_hello.jpg')
							})
						})

						context('when having a matching FS date', function() {
							beforeEach(() => {
								date__fs_ms__current = REAL_CREATION_DATE_MS
							})

							it('should trust the previous run as primary and ignore FS which cannot give us anything more', () => {
								let state = create_test_file_state()

								const bcdm = get_best_creation_date_meta(state)
								expect(bcdm.source, 'source').to.equal('some_basename_normalized')
								expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal('2017-10-20_05h01m44s625')
								expect(bcdm.confidence, 'confidence').to.equal('primary')
								expect(bcdm.is_fs_matching, 'fs matching').to.be.true

								// final as integration
								expect(get_ideal_basename(state), 'ideal basename').to.equal('MM2017-10-20_05h01m44s625_hello.jpg')
							})
						})
					})
				})

				// TODO fix unit tests
				context.skip('when NOT having a date in the basename', function () {

					context('when having hints -- from parent folder only', function() {
						beforeEach(() => {
							parent_folder_name__current = '20171010 - holiday at the beach'
						})

						context('when FS is matching (date range)', function () {
							beforeEach(() => {
								date__fs_ms__current = REAL_CREATION_DATE_MS
							})

							it('should use FS as primary', () => {
								let state = create_test_file_state()

								const bcdm = get_best_creation_date_meta(state)
								expect(bcdm.source, 'source').to.equal('original_fs+original_env_hints')
								expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal('2017-10-20_05h01m44s625')
								expect(bcdm.confidence, 'confidence').to.equal('primary')
								expect(bcdm.is_fs_matching, 'fs matching').to.be.true

								// final as integration
								expect(get_ideal_basename(state), 'ideal basename').to.equal('MM2017-10-20_05h01m44s625_bar.jpg')
							})
						})

						context('when FS is NOT matching', function () {
							beforeEach(() => {
								date__fs_ms__current = BAD_CREATION_DATE_CANDIDATE_MS
							})

							it('should use parent folder but NOT great confidence', () => {
								let state = create_test_file_state()

								const bcdm = get_best_creation_date_meta(state)
								expect(bcdm.source, 'source').to.equal('env_hints')
								expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal('2017-10-10')
								expect(bcdm.confidence, 'confidence').to.equal('secondary')
								expect(bcdm.is_fs_matching, 'fs matching').to.be.false

								// final as integration
								expect(get_ideal_basename(state), 'ideal basename').to.equal('bar.jpg') // no confidence
							})
						})
					})

					context('when having hints -- from reliable neighbors only', function() {
						beforeEach(() => {
							hints_from_reliable_neighbors__current__range = [ 20171010, 20171022 ]
							hints_from_reliable_neighbors__current__fs_reliability = true
						})

						context('when FS is matching (date range)', function () {
							beforeEach(() => {
								date__fs_ms__current = REAL_CREATION_DATE_MS
							})

							it('should use FS as primary', () => {
								let state = create_test_file_state()

								const bcdm = get_best_creation_date_meta(state)
								expect(bcdm.source, 'source').to.equal('original_fs+original_env_hints')
								expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal('2017-10-20_05h01m44s625')
								expect(bcdm.confidence, 'confidence').to.equal('primary')
								expect(bcdm.is_fs_matching, 'fs matching').to.be.true

								// final as integration
								expect(get_ideal_basename(state), 'ideal basename').to.equal('MM2017-10-20_05h01m44s625_bar.jpg')
							})
						})

						context('when FS is NOT matching', function () {
							beforeEach(() => {
								date__fs_ms__current = BAD_CREATION_DATE_CANDIDATE_MS
							})

							it('should default to original FS with lowest confidence', () => {
								let state = create_test_file_state()

								const bcdm = get_best_creation_date_meta(state)
								expect(bcdm.source, 'source').to.equal('original_fs')
								expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal('2016-11-20_23h08m07s654')
								expect(bcdm.confidence, 'confidence').to.equal('junk')
								expect(bcdm.is_fs_matching, 'fs matching').to.be.true

								// final as integration
								expect(get_ideal_basename(state), 'ideal basename').to.equal('bar.jpg') // no confidence
							})
						})
					})

					context('when having NO hints from environment', function() {

						it('should default to original FS with lowest confidence', () => {
							let state = create_test_file_state()

							const bcdm = get_best_creation_date_meta(state)
							expect(bcdm.source, 'source').to.equal('original_fs')
							expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal('2016-11-20_23h08m07s654')
							expect(bcdm.confidence, 'confidence').to.equal('junk')
							expect(bcdm.is_fs_matching, 'fs matching').to.be.true

							// final as integration
							expect(get_ideal_basename(state), 'ideal basename').to.equal('bar.jpg') // no confidence
						})
					})
				})
			})
		})

		context('when encountering the file again == having notes incl. original data', function() {
			// There are too many cases, we pick only a few notable ones
			beforeEach(() => {
				notes = 'auto'
			})

			context('when having a manual date', function() {

				it('should have the absolute priority')
			})

			context('when NOT having a manual date', function () {

				context('when having an EXIF date', function() {

					it('should have priority')
				})

				context('when NOT having an EXIF date', function() {
					beforeEach(() => {
						date__exif = null
					})

					context('when having a date in the ORIGINAL basename -- NON normalized', function() {

						context('when having a date in the CURRENT basename', function() {

							context('when the CURRENT basename is already normalized and valid', function() {

								context(' real bug encountered 2020/12/16', function() {
									beforeEach(() => {
										date__fs_ms__original = 1564542022000 // close but not exact match
										date__fs_ms__current = date__fs_ms__original // TODO test with random
										file_basename__original = 'Capture d’écran 2019-07-31 à 21.00.15.png'
										file_basename__current = 'MM2019-07-31_21h00m15_screenshot.png' // perfectly matching
									})

									it(`should be stable = no change`, () => {
										let state = create_test_file_state()

										const bcdm = get_best_creation_date_meta(state)
										expect(bcdm.source, 'source').not.to.equal('some_basename_normalized') // data was restored identical from original data
										expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal('2019-07-31_21h00m15')
										expect(bcdm.confidence, 'confidence').to.equal('primary')
										expect(bcdm.is_fs_matching, 'fs matching').to.be.false

										// final as integration
										expect(get_ideal_basename(state), 'ideal basename').to.equal(file_basename__current)
									})
								})
							})

							it('should pick the ORIGINAL basename date first')
						})

						context('when having a CURRENT FS not matching but an ORIGINAL FS matching', function() {

							it('should always enrich with the original FS')
						})
					})

					context('when having a date in the ORIGINAL basename -- NORMALIZED', function() {

						context('when having a date in the CURRENT basename', function() {

							it('should pick the ORIGINAL basename date first')
						})
					})

					context('when NOT having a date in the original basename', function() {

						context('when having ORIGINAL hints', function() {

							it('should use the original hints over the current ones')
						})
					})
				})
			})
		})
	})

	describe('get_ideal_basename()', function () {

		context('when encountering the file for the first time', function () {
			type TCIdeal = { [k: string]: string }
			const TEST_CASES: TCIdeal = {
				// no date in basename
				'P1000010.JPG': 'MM2018-11-21_06h00m45s627_P1000010.jpg',
				'IMG_3211.JPG': 'MM2018-11-21_06h00m45s627_x3211.jpg',
				'TR81801414546EGJ.jpg': 'MM2018-11-21_06h00m45s627_TR81801414546EGJ.jpg', // lot of digits but not a date
				// basename has date, takes precedence
				'IMG_20130525.JPG': 'MM2013-05-25.jpg',
				'IMG_20181121.PNG': 'MM2018-11-21_06h00m45s627.png', // fs increases precision since compatible with file date
				'20180603_taronga_vivd.gif': 'MM2018-06-03_taronga_vivd.gif',
				// already normalized but no notes about it
				'MM2017-10-20_05h01m44s625.jpg': 'MM2017-10-20_05h01m44s625.jpg'
			}
			Object.keys(TEST_CASES).forEach(tc_key => {
				it(`should work = concatenate the date and meaningful part -- "${ tc_key }"`, () => {
					let state = create(tc_key)
					const creation_date_ms = get_timestamp_utc_ms_from(create_better_date('tz:auto', 2018, 11, 21, 6, 0, 45, 627))

					state = on_fs_stats_read(state, {
						birthtimeMs: creation_date_ms,
						atimeMs: creation_date_ms + 10000,
						mtimeMs: creation_date_ms + 10000,
						ctimeMs: creation_date_ms + 10000,
					})
					if (is_exif_powered_media_file(state))
						state = on_exif_read(state, { SourceFile: tc_key } as any)
					state = on_hash_computed(state, '1234')
					state = on_notes_recovered(state, null)
					state = on_neighbors_hints_collected(state, null, undefined)

					//console.log(get_best_creation_date_meta(state))
					expect(get_ideal_basename(state, { requested_confidence: false }), tc_key).to.equal(TEST_CASES[tc_key])
				})
			})
		})

		context('when encountering the file again', function () {

			// real bug encountered 2020/12/16
			const CURRENT_BASENAME = 'MM2019-07-31_21h00m15_screenshot.png'
			it(`should be stable = no change, even without authoritative EXIF`, () => {
				let state = create(CURRENT_BASENAME)
				const creation_date_ms = 1564542022000
				state = on_fs_stats_read(state, {
					birthtimeMs: creation_date_ms,
					atimeMs: creation_date_ms + 10000, // TODO test with random
					mtimeMs: creation_date_ms + 10000,
					ctimeMs: creation_date_ms + 10000,
				})
				if (is_exif_powered_media_file(state))
						state = on_exif_read(state, {} as any)
				state = on_hash_computed(state, '1234')
				state = on_notes_recovered(state, {
					currently_known_as: CURRENT_BASENAME,
					renaming_source: undefined,

					deleted: false,
					starred: false,
					manual_date: undefined,

					original: {
						basename: 'Capture d’écran 2019-07-31 à 21.00.15.png',
						parent_path: 'foo',
						fs_birthtime_ms: creation_date_ms,
						is_fs_birthtime_assessed_reliable: false,
					}
				})
				state = on_neighbors_hints_collected(state, null, undefined)
				expect(get_ideal_basename(state), CURRENT_BASENAME).to.equal(CURRENT_BASENAME)
			})
		})

		context('when the basename has a copy marker', function() {
			function get_test_state() {
				const CURRENT_BASENAME = 'foo - copie 3.png'
				let state = create(CURRENT_BASENAME)
				const creation_date_ms = 1564542022000
				state = on_fs_stats_read(state, {
					birthtimeMs: creation_date_ms,
					atimeMs: creation_date_ms + 10000,
					mtimeMs: creation_date_ms + 10000,
					ctimeMs: creation_date_ms + 10000,
				})
				if (is_exif_powered_media_file(state))
						state = on_exif_read(state, {} as any)
				state = on_hash_computed(state, '1234')
				state = on_notes_recovered(state, null)
				state = on_neighbors_hints_collected(state, null, undefined)
				return state
			}

			it('should be removed by default', () => {
				expect(get_ideal_basename(get_test_state())).to.equal('foo.png')
			})

			it('should be internally preserved and can be optionally reused (normalized)', () => {
				expect(get_ideal_basename(get_test_state(), { copy_marker: 'preserve'})).to.equal('foo (3).png')
			})

			it('can be optionally overriden', () => {
				expect(get_ideal_basename(get_test_state(), { copy_marker: 7})).to.equal('foo (7).png')
			})
		})
	})

	describe('merge_notes()', function () {

		it('should work and pick the best of all') // this is tested as part of merge_duplicates()
	})

	describe('merge_duplicates()', function() {

		describe('assumptions', function() {

			it('should not affect the hash if ctimes change,', () => {
				// verified: OK
				// shasum A
				// shasum B
				// touch  B
				// shasum B
			})
		})

		describe('notes merging', function () {

			it('should always merge notes and pick the best of all', () => {
				const _s1 = create_demo()
				const s1 = enforce_immutability<State>({
					..._s1,
					notes: {
						..._s1.notes,
						starred: true,
					}
				} as any)
				const _s2 = create_demo()
				const s2 = enforce_immutability<State>({
					..._s2,
					notes: {
						..._s2.notes,
						original: {
							..._s2.notes.original,
							parent_path: '2007/20070102 - foo', // imagine was manually sorted
						}
					}
				} as any)
				const s3 = create_demo('foo/bar - copy.jpg', EARLIER_CREATION_DATE) // should not impact

				const s_order1 = merge_duplicates(s1, s2, s3)
				expect(s_order1.notes, 'order1').to.deep.equal({
					currently_known_as: 'bar.jpg', // selected as "the best" bc shortest
					renaming_source: undefined,
					deleted: undefined,
					starred: true, // correctly preserved
					manual_date: undefined,
					original: {
						basename: 'original.jpg',
						parent_path: 'foo',
						fs_birthtime_ms: get_timestamp_utc_ms_from(EARLIER_CREATION_DATE),
						is_fs_birthtime_assessed_reliable: false,
						exif_orientation: undefined,
					},
				})
				const s_order2 = merge_duplicates(s3, s2, s1)
				expect(s_order2.notes, 'order2').to.deep.equal({
					// same as previous
					currently_known_as: 'bar.jpg',
					renaming_source: undefined,
					deleted: undefined,
					starred: true,
					manual_date: undefined,
					original: {
						basename: 'original.jpg',
						parent_path: 'foo',
						fs_birthtime_ms: get_timestamp_utc_ms_from(EARLIER_CREATION_DATE),
						is_fs_birthtime_assessed_reliable: false,
						exif_orientation: undefined,
					},
				})
			})
		})

		context('when there are no differences', function() {

			it('should pick the 1st one', () => {
				const s1 = create_demo()
				const s2 = create_demo()
				const s3 = create_demo()
				expectㆍfileㆍstatesㆍdeepㆍequal(s1, s2)
				expectㆍfileㆍstatesㆍdeepㆍequal(s1, s3)

				const s = merge_duplicates(s1, s2, s3)
				expect(s).not.to.equal(s1)
				expect(s).not.to.equal(s2)
				expect(s).not.to.equal(s3)
				expectㆍfileㆍstatesㆍdeepㆍequal(s, s1)
			})
		})

		context('when some of them are recognized as copies (have a copy index)', function() {

			context('when one of them is not recognized as a copy', function() {

				it('should pick the non-copy', () => {
					const s1 = create_demo('foo/bar - copy 02.jpg')
					const s2 = create_demo('foo/bar same lgth.jpg') // same length to no rely on "shortest"
					const s3 = create_demo('foo/bar - copy 07.jpg')
					expectㆍfileㆍstatesㆍNOTㆍdeepㆍequal(s1, s2)
					expectㆍfileㆍstatesㆍNOTㆍdeepㆍequal(s1, s3)

					const s = merge_duplicates(s1, s2, s3)
					expect(s).not.to.equal(s1)
					expect(s).not.to.equal(s2)
					expect(s).not.to.equal(s3)
					expectㆍfileㆍstatesㆍdeepㆍequal(s, s2)
				})
			})

			context('when all of them are recognized as a copy', function() {

				it('should pick the earliest copy', () => {
					const s1 = create_demo('foo/bar - 01.jpg')
					const s2 = create_demo('foo/bar - copy 03.jpg')
					expectㆍfileㆍstatesㆍNOTㆍdeepㆍequal(s1, s2)

					const s = merge_duplicates(s1, s2)
					expect(s).not.to.equal(s1)
					expect(s).not.to.equal(s2)
					expectㆍfileㆍstatesㆍdeepㆍequal(s, s1)
				})
			})
		})

		context('when some have different best creation date', function() {

			it('should pick the earliest one', () => {
				const s1 = create_demo()
				const s2 = create_demo('foo/bar.jpg', EARLIER_CREATION_DATE)
				const s3 = create_demo()
				/*console.log({
					s1: get_best_creation_date(s1),
					s2: get_best_creation_date(s2),
				})*/

				const s = merge_duplicates(s1, s2, s3)
				expect(s).not.to.equal(s1)
				expect(s).not.to.equal(s2)
				expect(s).not.to.equal(s3)
				expectㆍfileㆍstatesㆍdeepㆍequal(s, s2)
			})
		})

		context('when some have different names', function() {

			it('should pick the shortest one', () => {
				const s1 = create_demo('foo/bar from email.jpg')
				const s2 = create_demo()
				const s3 = create_demo('foo/bar - duplicate.jpg')

				const s = merge_duplicates(s1, s2, s3)
				expect(s).not.to.equal(s1)
				expect(s).not.to.equal(s2)
				expect(s).not.to.equal(s3)
				expectㆍfileㆍstatesㆍdeepㆍequal(s, s2)
			})
		})

		context('when some of them are in a meaningful parent folder', function() {

			it('should pick one with a meaningful parent folder', () => {
				const s1 = create_demo()
				const s2 = create_demo('2007/20070102 - foo/bar.jpg')
				const s3 = create_demo()

				const s = merge_duplicates(s1, s2, s3)
				expect(s).not.to.equal(s1)
				expect(s).not.to.equal(s2)
				expect(s).not.to.equal(s3)
				expectㆍfileㆍstatesㆍdeepㆍequal(s, s2)
			})
		})

		describe('real cases', function () {

			it('should work - 1', () => {
				const s1 = create_demo('- inbox/IMG_20160327_102742 2.jpg')
				const s2 = create_demo('- inbox/IMG_20160327_102742.jpg')

				const s = merge_duplicates(s1, s2)
				expectㆍfileㆍstatesㆍdeepㆍequal(s, s2)
			})

			it('should work - 2', () => {
				const s1 = create_demo('Screen Shot 2019-08-01 at 00.40.33 copy 4.png')
				const s2 = create_demo('Screen Shot 2019-08-01 at 00.40.33 copy 3.png')
				const s3 = create_demo('Screen Shot 2019-08-01 at 00.40.33 copy 2.png')
				const s4 = create_demo('Screen Shot 2019-08-01 at 00.40.33 copy.png')
				const s5 = create_demo('Screen Shot 2019-08-01 at 00.40.33.png')

				const s = merge_duplicates(s1, s2, s2, s3, s4, s5)
				expectㆍfileㆍstatesㆍdeepㆍequal(s, s5)
			})
		})
	})

	describe('integration', function() {

		describe('real files', function() {
			//this.timeout(5000)

			ALL_MEDIA_DEMOS.forEach(({ data: MEDIA_DEMO, get_state }, index) => {
				it(`should work - #${index}: "${MEDIA_DEMO.BASENAME}"`, async () => {
					let state = await get_state()

					expect(get_current_basename(state)).to.equal(MEDIA_DEMO.BASENAME)
					expect(get_current_parent_folder_id(state)).to.equal('.')

					expect(get_best_creation_year(state)).to.equal(MEDIA_DEMO.YEAR)
					expect(get_best_creation_date_compact(state)).to.equal(MEDIA_DEMO.DATE__COMPACT)
					expect(get_embedded_timezone(get_best_creation_date(state))).to.deep.equal(MEDIA_DEMO.FINAL_TZ)
					expect(get_human_readable_timestamp_auto(get_best_creation_date(state), 'tz:embedded')).to.deep.equal(MEDIA_DEMO.DATE__HUMAN_AUTO)
					expect(get_ideal_basename(state)).to.equal(MEDIA_DEMO.IDEAL_BASENAME)
				})
			})
		})
	})
})
