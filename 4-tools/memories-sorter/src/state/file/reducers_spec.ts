import { expect } from 'chai'

import { Immutable } from '@offirmo-private/ts-types'
import { enforce_immutability } from '@offirmo-private/state-utils'

import { LIB } from '../../consts'
import {
	FileId,
	PersistedNotes,
	State,
	merge_duplicates,
} from '.'
import {
	_get_exif_datetime,
	create_better_date,
	get_timestamp_utc_ms_from,
} from '../../services/better-date'
import {
	get_test_single_file_state_generator,
} from '../../__test_shared/utils'

import {
	expectㆍfileㆍstatesㆍdeepㆍequal,
	expectㆍfileㆍstatesㆍNOTㆍdeepㆍequal,
} from './__test_shared'

/////////////////////

describe(`${LIB} - file (state)`, function() {

	describe('reducers', function () {

		describe('merge_notes()', function () {

			it('should work and pick the best of all') // this is tested as part of merge_duplicates()
		})

		describe('merge_duplicates()', function() {
			const CREATION_DATE         = create_better_date('tz:auto', 2017, 10, 20, 5, 1, 44, 625)
			const EARLIER_CREATION_DATE = create_better_date('tz:auto', 2017, 10, 18, 5, 1, 44, 625)

			function create_demo(id: FileId = 'foo/bar.jpg', time = CREATION_DATE): Immutable<State> {
				const splitted = id.split('/')
				const basename = splitted.pop() as string
				const parent_relpath = splitted.join('/')

				const stategen = get_test_single_file_state_generator()
				stategen.inputs.basename__current = basename
				stategen.inputs.parent_relpath__current = parent_relpath ?? stategen.inputs.parent_relpath__current
				stategen.inputs.date__fs_ms__current = get_timestamp_utc_ms_from(time)
				stategen.inputs.date__exif = _get_exif_datetime(time)
				stategen.inputs.notes = 'auto'
				stategen.inputs.autoǃdate__fs_ms__historical = get_timestamp_utc_ms_from(EARLIER_CREATION_DATE)

				let state = stategen.create_state()
				expect(state.id, 'create_demo internal').to.equal(id)

				// yes, real case = since having the same hash,
				// all the files will have the same notes.
				/*state = on_notes_recovered(state, {
					currently_known_as: 'whatever, will be replaced.jpg',
					renaming_source: undefined,

					starred: undefined,
					deleted: undefined,
					manual_date: undefined,

					best_date_afawk_symd: get_compact_date(CREATION_DATE, 'tz:embedded'),

					historical: {
						basename: 'original' + path.parse(id).ext, // extensions should match
						parent_path: 'foo',
						fs_bcd_tms: get_timestamp_utc_ms_from(EARLIER_CREATION_DATE),
						neighbor_hints: {
							parent_folder_bcd: undefined,
							fs_bcd_assessed_reliability: 'unknown',
						},
					}
				})
				expect(state.notes.currently_known_as, 'currently_known_as').to.equal(path.parse(id).base)*/

				return enforce_immutability(state)
			}

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
							historical: {
								..._s2.notes.historical,
								parent_path: '2007/20070102 - foo', // imagine was manually sorted
							}
						}
					} as any)
					const s3 = create_demo('foo/bar - copy.jpg', EARLIER_CREATION_DATE) // should not impact

					const EXPECTED_MERGED_NOTES: PersistedNotes = {
						currently_known_as: 'bar.jpg', // selected as "the best" bc shortest
						renaming_source: undefined,
						best_date_afawk_symd: undefined,
						deleted: undefined,
						starred: true, // correctly preserved
						manual_date: undefined,
						historical: {
							basename: 'original.jpg',
							parent_path: 'original_parent_path',
							fs_bcd_tms: get_timestamp_utc_ms_from(EARLIER_CREATION_DATE),
							neighbor_hints: {
								'TODO': 'todo',
								//fs_bcd_assessed_reliability: 'unknown',
								//parent_folder_bcd: undefined,
							} as any,
							exif_orientation: undefined,
							trailing_extra_bytes_cleaned: undefined,
						},
					}
					const s_order1 = merge_duplicates(s1, s2, s3)
					expect(s_order1.notes, 'order1').to.deep.equal(EXPECTED_MERGED_NOTES)
					const s_order2 = merge_duplicates(s3, s2, s1)
					expect(s_order2.notes, 'order2').to.deep.equal(EXPECTED_MERGED_NOTES)
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
	})
})