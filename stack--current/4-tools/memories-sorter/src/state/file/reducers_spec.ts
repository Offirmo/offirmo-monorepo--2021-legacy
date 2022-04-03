import path from 'path'
import { expect } from 'chai'

import { Immutable } from '@offirmo-private/ts-types'
import { enforce_immutability } from '@offirmo-private/state-utils'

import { LIB } from '../../consts'
import {
	FileId,
	PersistedNotes,
	State,
	HistoricalData,
	merge_notes,
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

		describe('notes taking', function() {

			it('should update the historical notes when encountering informations')

			describe('merge_notes()', function () {

				it('should work and pick the best of all') // this is tested as part of merge_duplicates()

				describe('merge_historical', function() {

					// real case
					it('should stay stable', () => {
						const oldest_notes: PersistedNotes = {
							// backup
							historical: {
								basename: "Chien Michèle.avi",
								parent_path: "Chien Michèle",
								fs_bcd_tms: 1079269608000,
								neighbor_hints: {
									// no valuable hints, no useful reliability
								},
							},

							deleted: undefined,
							starred: undefined,
							manual_date: undefined,

							_currently_known_as: 'whatever',
							_bcd_afawk‿symd: undefined,
							_bcd_source: undefined,
						}

						const second_exec_notes: PersistedNotes = {
							// backup
							historical: {
								basename: "Chien Michèle.avi",
								parent_path: "20040314 - Chien Michèle", // normalized!
								fs_bcd_tms: 1079269608000,
								neighbor_hints: {
									fs_reliability: 'reliable', // XXX now reliable thanks to hint in parent path matching the fs,
									// HOWEVER this doesn't bring any info since the folder date is from the fs in the first place!
								},
							},

							deleted: undefined,
							starred: undefined,
							manual_date: undefined,

							_currently_known_as: 'whatever',
							_bcd_afawk‿symd: undefined,
							_bcd_source: undefined,
						}

						// strict reflexion of oldest notes
						const expected_historical_notes: HistoricalData = {
								basename: "Chien Michèle.avi",
								parent_path: "Chien Michèle",
								fs_bcd_tms: 1079269608000,
								neighbor_hints: {
									// no valuable hints, no useful reliability
								},
							}

						expect(merge_notes(oldest_notes, second_exec_notes).historical, 'o/2').to.deep.equal(expected_historical_notes)
						expect(merge_notes(second_exec_notes, oldest_notes).historical, '2/o').to.deep.equal(expected_historical_notes)
					})
				})
			})

			describe('merge_duplicates()', function() {
				const CREATION_DATE         = create_better_date('tz:auto', 2017, 10, 20, 5, 1, 44, 625)
				const EARLIER_CREATION_DATE = create_better_date('tz:auto', 2017, 10, 18, 5, 1, 44, 625)

				function create_demo(id: FileId = 'foo/bar.jpg', time = CREATION_DATE): Immutable<State> {
					const splitted = id.split(path.sep)
					const basename = splitted.pop() as string
					const parent_relpath = splitted.join(path.sep)

					const stategen = get_test_single_file_state_generator()
					stategen.inputs.basenameⵧcurrent = basename
					stategen.inputs.parent_pathⵧcurrent‿relative = parent_relpath ?? stategen.inputs.parent_pathⵧcurrent‿relative
					stategen.inputs.dateⵧfsⵧcurrent‿tms = get_timestamp_utc_ms_from(time)
					stategen.inputs.dateⵧexif = _get_exif_datetime(time)
					stategen.inputs.notes = 'auto'
					stategen.inputs.autoǃdate__fs_ms__historical = get_timestamp_utc_ms_from(EARLIER_CREATION_DATE)

					let state = stategen.create_state()
					expect(state.id, 'create_demo internal').to.equal(id)

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

				describe('notes merging', function() {

					it('should always merge notes and pick the best of all', () => {
						const _s1 = create_demo('foo/bar.jpg')
						const s1 = enforce_immutability<State>({
							..._s1,
							notes: {
								..._s1.notes,
								starred: true,
							}
						})
						const _s2 = create_demo('foo/very very long/ha ha/bar.jpg')
						const s2 = enforce_immutability<State>({
							..._s2,
						})
						const s3 = create_demo('foo/bar - copy.jpg', EARLIER_CREATION_DATE) // should not impact

						const EXPECTED_MERGED_NOTES: PersistedNotes = {
							_currently_known_as: 'foo/very very long/ha ha/bar.jpg', // selected as "the best" bc shortest basename + longest overall path
							_bcd_afawk‿symd: undefined,
							_bcd_source: undefined,
							deleted: undefined,
							starred: true, // correctly preserved
							manual_date: undefined,
							historical: {
								basename: 'original.jpg',
								parent_path: 'original_parent_path',
								fs_bcd_tms: get_timestamp_utc_ms_from(EARLIER_CREATION_DATE),
								neighbor_hints: {},
								exif_orientation: undefined,
								trailing_extra_bytes_cleaned: undefined,
							},
						}
						const s_order1 = merge_duplicates(s1, s2, s3)
						expect(s_order1.notes, 'order1').to.deep.equal(EXPECTED_MERGED_NOTES)
						const s_order2 = merge_duplicates(s3, s2, s1)
						expect(s_order2.notes, 'order2').to.deep.equal(EXPECTED_MERGED_NOTES)
					})

					describe('note.historical merging', function() {

						it('should also properly merge historical notes and pick the best of all', () => {
							const _s1 = create_demo()
							const s1 = enforce_immutability<State>({
								..._s1,
								notes: {
									..._s1.notes,
									historical: {
										..._s1.notes.historical,
										exif_orientation: 3,
									}
								}
							})
							const _s2 = create_demo('20010325 - life/2001-03-24_12h34m56s789.jpg') // should NOT be picked since normalized
							const s2 = enforce_immutability<State>({
								..._s2,
								notes: {
									..._s2.notes,
									historical: {
										..._s2.notes.historical,
										exif_orientation: 3,
									}
								}
							})
							const _s3 = create_demo('foo/bar - copy.jpg', EARLIER_CREATION_DATE) // should date should be picked
							const s3 = enforce_immutability<State>({
								..._s3,
								notes: {
									..._s3.notes,
									historical: {
										..._s3.notes.historical,
										exif_orientation: 3,
									}
								}
							})

							const EXPECTED_MERGED_NOTES: PersistedNotes = {
								_currently_known_as: 'foo/bar.jpg', // selected as "the best" bc shortest basename
								_bcd_afawk‿symd: undefined,
								_bcd_source: undefined,
								deleted: undefined,
								starred: undefined,
								manual_date: undefined,
								historical: {
									basename: 'original.jpg',
									parent_path: 'original_parent_path',
									fs_bcd_tms: get_timestamp_utc_ms_from(EARLIER_CREATION_DATE),
									neighbor_hints: {},
									exif_orientation: 3,
									trailing_extra_bytes_cleaned: undefined,
								},
							}

							/*console.log({
								s1: s1.notes.historical,
								s2: s2.notes.historical,
								s3: s3.notes.historical,
								EXPECTED_MERGED_NOTES
							})*/
							const s_order1 = merge_duplicates(s1, s2, s3)
							//console.log(s_order1.notes.historical)
							expect(s_order1.notes, 'order1').to.deep.equal(EXPECTED_MERGED_NOTES)
							const s_order2 = merge_duplicates(s3, s2, s1)
							//console.log(s_order2.notes.historical)
							expect(s_order2.notes, 'order2').to.deep.equal(EXPECTED_MERGED_NOTES)
						})

						describe('note.historical.neighbor_hints merging', function() {

							it('should also properly merge and pick the best of all', () => {
								const _s1 = create_demo()
								const s1 = enforce_immutability<State>({
									..._s1,
									notes: {
										..._s1.notes,
										historical: {
											..._s1.notes.historical,
											neighbor_hints: {
												// no hints at all
											},
										},
									},
								})
								const _s2 = create_demo()
								const s2 = enforce_immutability<State>({
									..._s2,
									notes: {
										..._s2.notes,
										historical: {
											..._s2.notes.historical,
											// should NOT be selected bc
											// 1) parent_path is normalized = not oldest
											// 2) parent_bcd depends on parent_path and is nearly worthless anyway (and is even redundant in this case)
											parent_path: 'tosort/2001/20010325 - life',
											neighbor_hints: {
												parent_bcd: {
													year: 2001,
													month: 3,
													day: 25,
													tz: 'tz:auto',
												}
											},
										},
									},
								})
								const _s3 = create_demo('foo/bar - copy.jpg', EARLIER_CREATION_DATE) // should not impact
								const s3 = enforce_immutability<State>({
									..._s3,
									notes: {
										..._s3.notes,
										historical: {
											..._s3.notes.historical,
											neighbor_hints: {
												fs_reliability: 'reliable',
											},
										},
									},
								})
								const _s4 = create_demo()
								const s4 = enforce_immutability<State>({
									..._s4,
									notes: {
										..._s4.notes,
										historical: {
											..._s4.notes.historical,
											neighbor_hints: {
												fs_reliability: 'unknown',
											},
										},
									},
								})

								const EXPECTED_MERGED_NOTES: PersistedNotes = {
									..._s1.notes,
									historical: {
										..._s1.notes.historical,
										fs_bcd_tms: get_timestamp_utc_ms_from(EARLIER_CREATION_DATE), // selected from s3 thanks to neighbor_hints.fs_reliability
										parent_path: 'original_parent_path',
										neighbor_hints: {
											fs_reliability: 'reliable',
										},
									},
								}
								/*console.log({
									s1: s1.notes.historical,
									s2: s2.notes.historical,
									s3: s3.notes.historical,
									s4: s4.notes.historical,
									EXPECTED_MERGED_NOTES
								})*/
								const s_order1 = merge_duplicates(s1, s2, s3, s4)
								expect(s_order1.notes, 'order1').to.deep.equal(EXPECTED_MERGED_NOTES)
								const s_order2 = merge_duplicates(s4, s3, s2, s1)
								expect(s_order2.notes, 'order2').to.deep.equal(EXPECTED_MERGED_NOTES)
							})
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
		})
	})
})
