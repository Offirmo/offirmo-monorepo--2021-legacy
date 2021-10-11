import { expect } from 'chai'

import { LIB } from '../../consts'
import {
	create,
	get_best_creation_date‿meta,
	get_best_creation_dateⵧfrom_current_data‿meta,
	get_best_creation_dateⵧfrom_oldest_known_data‿meta,
	get_ideal_basename,
	is_exif_powered_media_file,
	on_info_read__current_neighbors_primary_hints,
	on_info_read__exif,
	on_info_read__fs_stats,
	on_info_read__hash,
	on_notes_recovered,
} from '.'
import {
	create_better_date,
	create_better_date_obj,
	get_human_readable_timestamp_auto,
	get_timestamp_utc_ms_from,
} from '../../services/better-date'
import {
	get_test_single_file_state_generator,
	REAL_CREATION_DATE‿EXIF,
	REAL_CREATION_DATE‿TMS,
	REAL_CREATION_DATE‿HRTS,
	BAD_CREATION_DATE_CANDIDATE‿TMS,
} from '../../__test_shared/utils'
import * as NeighborHintsLib from './sub/neighbor-hints'

import './__test_shared'

/////////////////////

describe.only(`${LIB} - file (state)`, function() {

	describe('selectors', function() {

		describe('get_best_creation_date()', function() {
			const stategen = get_test_single_file_state_generator()
			beforeEach(() => stategen.reset())

			context.only('when encountering the file for the 1st time == NOT having notes incl. historical data', function() {

				// not possible since 1st encounter!
				//describe('when having a manual date'

				context('when having an EXIF date', function() {
					beforeEach(() => {
						stategen.inputs.dateⵧexif = REAL_CREATION_DATE‿EXIF
					})

					it('should be prioritized as a primary source', () => {
						let state = stategen.create_state()

						const bcdmⵧoldest = get_best_creation_dateⵧfrom_oldest_known_data‿meta(state)
						expect(bcdmⵧoldest.source, 'oldest.source').to.equal('exifⵧoldest')

						const bcdmⵧcurrent = get_best_creation_dateⵧfrom_current_data‿meta(state)
						expect(bcdmⵧcurrent.source, 'current.source').to.equal('exifⵧcurrent')

						expect(bcdmⵧoldest.source.replaceAll('oldest', 'xxx'), 'O+C same source on 1st encounter')
							.to.equal(bcdmⵧcurrent.source.replaceAll('current', 'xxx'))
						expect(get_human_readable_timestamp_auto(bcdmⵧoldest.candidate, 'tz:embedded'), 'O+C same date on 1st encounter')
							.to.equal(get_human_readable_timestamp_auto(bcdmⵧcurrent.candidate, 'tz:embedded'))

						const bcdm = get_best_creation_date‿meta(state)
						expect(bcdm.source, 'source').to.equal('exifⵧoldest') // oldest indeed, those are original data afawk
						expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal('2017-10-20_05h01m44s625')
						expect(bcdm.confidence, 'confidence').to.equal('primary')
						expect(bcdm.is_fs_matching, 'fs matching').to.be.false

						// final as integration
						expect(get_ideal_basename(state), 'ideal basename').to.equal('MM2017-10-20_05h01m44s625_bar.jpg')
					})
				})

				context('when NOT having EXIF date', function() {
					beforeEach(() => {
						stategen.inputs.dateⵧexif = null
					})

					context('when having a date from a NP basename', function() {

						beforeEach(() => {
							stategen.inputs.basenameⵧcurrent = 'IMG_20171020_0501.jpg'
						})

						context('when having a matching FS date', function() {
							beforeEach(() => {
								stategen.inputs.dateⵧfsⵧcurrent‿tms = REAL_CREATION_DATE‿TMS
							})

							it('should use the basename and enrich it with fs, as primary', () => {
								let state = stategen.create_state()

								const bcdmⵧoldest = get_best_creation_dateⵧfrom_oldest_known_data‿meta(state)
								expect(bcdmⵧoldest.source, 'oldest.source').to.equal('basename_npⵧoldest+fs')

								const bcdmⵧcurrent = get_best_creation_dateⵧfrom_current_data‿meta(state)
								expect(bcdmⵧcurrent.source, 'current.source').to.equal('basename_npⵧcurrent+fs')

								expect(bcdmⵧoldest.source.replaceAll('oldest', 'xxx'), 'O+C same source on 1st encounter')
									.to.equal(bcdmⵧcurrent.source.replaceAll('current', 'xxx'))
								expect(get_human_readable_timestamp_auto(bcdmⵧoldest.candidate, 'tz:embedded'), 'O+C same date on 1st encounter')
									.to.equal(get_human_readable_timestamp_auto(bcdmⵧcurrent.candidate, 'tz:embedded'))

								const bcdm = get_best_creation_date‿meta(state)
								expect(bcdm.source, 'source').to.equal('basename_npⵧoldest+fs')
								expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal('2017-10-20_05h01m44s625')
								expect(bcdm.confidence, 'confidence').to.equal('primary')
								expect(bcdm.from_historical, 'origin').to.equal(true)
								expect(bcdm.is_fs_matching, 'fs matching').to.be.true

								// final as integration
								expect(get_ideal_basename(state), 'ideal basename').to.equal('MM2017-10-20_05h01m44s625.jpg')
							})
						})

						context('when NOT having a matching FS date', function() {
								beforeEach(() => {
									stategen.inputs.dateⵧfsⵧcurrent‿tms = BAD_CREATION_DATE_CANDIDATE‿TMS
								})

								it('should use the basename only as primary WITHOUT using fs', () => {
									let state = stategen.create_state()

									const bcdmⵧoldest = get_best_creation_dateⵧfrom_oldest_known_data‿meta(state)
									expect(bcdmⵧoldest.source, 'oldest.source').to.equal('basename_npⵧoldest')

									const bcdmⵧcurrent = get_best_creation_dateⵧfrom_current_data‿meta(state)
									expect(bcdmⵧcurrent.source, 'current.source').to.equal('basename_npⵧcurrent')

									expect(bcdmⵧoldest.source.replaceAll('oldest', 'xxx'), 'O+C same source on 1st encounter')
										.to.equal(bcdmⵧcurrent.source.replaceAll('current', 'xxx'))
									expect(get_human_readable_timestamp_auto(bcdmⵧoldest.candidate, 'tz:embedded'), 'O+C same date on 1st encounter')
										.to.equal(get_human_readable_timestamp_auto(bcdmⵧcurrent.candidate, 'tz:embedded'))

									const bcdm = get_best_creation_date‿meta(state)
									expect(bcdm.source, 'source').to.equal('basename_npⵧoldest')
									expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal('2017-10-20_05h01')
									expect(bcdm.confidence, 'confidence').to.equal('primary')
									expect(bcdm.from_historical, 'origin').to.equal(true)
									expect(bcdm.is_fs_matching, 'fs matching').to.be.false

									// final as integration
									expect(get_ideal_basename(state), 'ideal basename').to.equal('MM2017-10-20_05h01.jpg')
								})
							})
					})

					context('when NOT having a date from a NP basename', function () {

						context('when neighbour hints estimates FS reliability as: reliable', function() {
							stategen.inputs.neighbor_hints__fs_reliability_shortcut = 'reliable'
							beforeEach(() => {
								//stategen.inputs.dateⵧfsⵧcurrent‿tms = REAL_CREATION_DATE‿TMS
								//stategen.inputs.parent_pathⵧcurrent‿relative = '2017/20171010 - holiday at the beach'
								/*stategen.inputs.hints_from_reliable_neighbors__current__parent_folder_bcd = create_better_date_obj({
									year: 2017,
									month: 10,
									day: 10,
									tz: 'tz:auto',
								})*/
							})

							it('should use FS as primary', () => {
								let state = stategen.create_state()

								const bcdmⵧoldest = get_best_creation_dateⵧfrom_oldest_known_data‿meta(state)
								expect(bcdmⵧoldest.source, 'oldest.source').to.equal('fsⵧoldest+neighbor✔')

								const bcdmⵧcurrent = get_best_creation_dateⵧfrom_current_data‿meta(state)
								expect(bcdmⵧcurrent.source, 'current.source').to.equal('fsⵧcurrent+neighbor✔')

								expect(bcdmⵧoldest.source.replaceAll('oldest', 'xxx'), 'O+C same source on 1st encounter')
									.to.equal(bcdmⵧcurrent.source.replaceAll('current', 'xxx'))
								expect(get_human_readable_timestamp_auto(bcdmⵧoldest.candidate, 'tz:embedded'), 'O+C same date on 1st encounter')
									.to.equal(get_human_readable_timestamp_auto(bcdmⵧcurrent.candidate, 'tz:embedded'))

								expect(bcdmⵧoldest.source.replaceAll('oldest', 'xxx'), 'O+C same source on 1st encounter')
									.to.equal(bcdmⵧcurrent.source.replaceAll('current', 'xxx'))
								expect(get_human_readable_timestamp_auto(bcdmⵧoldest.candidate, 'tz:embedded'), 'O+C same date on 1st encounter')
									.to.equal(get_human_readable_timestamp_auto(bcdmⵧcurrent.candidate, 'tz:embedded'))

								const bcdm = get_best_creation_date‿meta(state)
								expect(bcdm.source, 'source').to.equal('fsⵧoldest+neighbor✔')
								expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal('2017-10-20_05h01m44s625')
								expect(bcdm.confidence, 'confidence').to.equal('primary')
								expect(bcdm.from_historical, 'origin').to.equal(true)
								expect(bcdm.is_fs_matching, 'fs matching').to.be.true

								// final as integration
								expect(get_ideal_basename(state), 'ideal basename').to.equal('MM2017-10-20_05h01m44s625_bar.jpg')
							})
						})

						context('when neighbour hints estimates FS reliability as: secondary', function() {

							beforeEach(() => {
								stategen.inputs.dateⵧfsⵧcurrent‿tms = BAD_CREATION_DATE_CANDIDATE‿TMS
							})

							it('should use parent folder but NOT great confidence', () => {
								// justification: if the parent folder has a date, means it strongly looks like an event
								// = implies that the PRIMARY children is matching
								// hence the file must have been manually sorted = must stay here
								// however it's a secondary
								let state = stategen.create_state()

								const bcdmⵧoldest = get_best_creation_dateⵧfrom_oldest_known_data‿meta(state)
								expect(bcdmⵧoldest.source, 'oldest.source').to.equal('basename_npⵧoldest+fs')

								const bcdmⵧcurrent = get_best_creation_dateⵧfrom_current_data‿meta(state)
								expect(bcdmⵧcurrent.source, 'current.source').to.equal('basename_npⵧcurrent+fs')

								const bcdm = get_best_creation_date‿meta(state)
								expect(bcdm.source, 'source').to.equal('current_env_hints')
								expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal('2017-10-10')
								expect(bcdm.confidence, 'confidence').to.equal('secondary')
								//expect(bcdm.from_historical, 'origin').to.equal(true) // TODO review
								expect(bcdm.is_fs_matching, 'fs matching').to.be.false

								// final as integration
								expect(get_ideal_basename(state), 'ideal basename').to.equal('bar.jpg') // no renaming since no confidence
							})
						})

						context('when neighbour hints estimates FS reliability as: junk', function() {

							beforeEach(() => {
								stategen.inputs.dateⵧfsⵧcurrent‿tms = BAD_CREATION_DATE_CANDIDATE‿TMS
							})

							it('should use parent folder but NOT great confidence', () => {
								// justification: if the parent folder has a date, means it strongly looks like an event
								// = implies that the PRIMARY children is matching
								// hence the file must have been manually sorted = must stay here
								// however it's a secondary
								let state = stategen.create_state()

								const bcdmⵧoldest = get_best_creation_dateⵧfrom_oldest_known_data‿meta(state)
								expect(bcdmⵧoldest.source, 'oldest.source').to.equal('basename_npⵧoldest+fs')

								const bcdmⵧcurrent = get_best_creation_dateⵧfrom_current_data‿meta(state)
								expect(bcdmⵧcurrent.source, 'current.source').to.equal('basename_npⵧcurrent+fs')

								const bcdm = get_best_creation_date‿meta(state)
								expect(bcdm.source, 'source').to.equal('current_env_hints')
								expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal('2017-10-10')
								expect(bcdm.confidence, 'confidence').to.equal('secondary')
								//expect(bcdm.from_historical, 'origin').to.equal(true) // TODO review
								expect(bcdm.is_fs_matching, 'fs matching').to.be.false

								// final as integration
								expect(get_ideal_basename(state), 'ideal basename').to.equal('bar.jpg') // no renaming since no confidence
							})
						})

						/*
							context('when having STRONG hints -- from reliable neighbors only', function() {
								beforeEach(() => {
									stategen.inputs.dateⵧfsⵧcurrent‿tms = REAL_CREATION_DATE‿TMS
									//hints_from_reliable_neighbors__current__range = [ 20171010, 20171022 ] // XXX
									stategen.inputs.neighbor_hints__fs_reliability_shortcut = 'reliable'
								})

								it('should use FS as primary', () => {
									let state = stategen.create_state()

									const bcdm = get_best_creation_date‿meta(state)
									expect(bcdm.source, 'source').to.equal('original_fs+original_env_hints')
									expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal('2017-10-20_05h01m44s625')
									expect(bcdm.confidence, 'confidence').to.equal('primary')
									expect(bcdm.from_historical, 'origin').to.equal(true)
									expect(bcdm.is_fs_matching, 'fs matching').to.be.true

									// final as integration
									expect(get_ideal_basename(state), 'ideal basename').to.equal('MM2017-10-20_05h01m44s625_bar.jpg')
								})
							})

							context('when having WEAK hints from environment', function() {

								it('should default to original FS with lowest confidence', () => {
									let state = stategen.create_state()

									const bcdm = get_best_creation_date‿meta(state)
									expect(bcdm.source, 'source').to.equal('original_fs')
									expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal('2016-11-21_09h08m07s654')
									expect(bcdm.confidence, 'confidence').to.equal('junk')
									expect(bcdm.from_historical, 'origin').to.equal(true)
									expect(bcdm.is_fs_matching, 'fs matching').to.be.true

									// final as integration
									expect(get_ideal_basename(state), 'ideal basename').to.equal('bar.jpg') // no confidence
								})
							})
							 */
					})
				})
			})

			context('when encountering the file again == having notes incl. original data', function() {
				// There are too many cases, we pick only a few notable ones
				beforeEach(() => {
					stategen.inputs.notes = 'auto'
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
							stategen.inputs.dateⵧexif = null
						})

						context('when having a date in the ORIGINAL basename -- NON processed', function() {

							context('when having a date in the CURRENT basename', function() {

								context('when the CURRENT basename is already normalized and valid', function() {

									context(' real bug encountered 2020/12/16', function() {
										beforeEach(() => {
											// = GMT: Wednesday, 31 July 2019 3:00:22 AM
											// not exact match but within acceptable range of a tz difference
											stategen.inputs.autoǃdate__fs_ms__historical = 1564542022000
											stategen.inputs.dateⵧfsⵧcurrent‿tms = stategen.inputs.autoǃdate__fs_ms__historical // TODO test with random
											stategen.inputs.autoǃbasename__historical = 'Capture d’écran 2019-07-31 à 21.00.15.png'
											stategen.inputs.basenameⵧcurrent = 'MM2019-07-31_21h00m15_screenshot.png' // perfectly matching
										})

										it(`should be stable = no change`, () => {
											let state = stategen.create_state()

											const bcdm = get_best_creation_date‿meta(state)
											expect(bcdm.source, 'source').not.to.equal('some_basename_normalized') // data was restored identical from original data
											expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal('2019-07-31_21h00m15')
											expect(bcdm.confidence, 'confidence').to.equal('primary')
											expect(bcdm.from_historical, 'origin').to.equal(true)
											expect(bcdm.is_fs_matching, 'fs matching').to.be.true

											// final as integration
											expect(get_ideal_basename(state), 'ideal basename').to.equal(stategen.inputs.basenameⵧcurrent)
										})
									})
								})

								it('should pick the ORIGINAL basename date first')
							})

							context('when having a CURRENT FS not matching but an ORIGINAL FS matching', function() {

								it('should always enrich with the original FS')
							})
						})

						context('when having a date in the ORIGINAL basename -- ALREADY processed', function() {

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
			const stategen = get_test_single_file_state_generator()
			beforeEach(() => stategen.reset())

			context('when encountering the file for the first time', function () {
				const BCD = create_better_date('tz:auto', 2018, 11, 21, 6, 0, 45, 627)

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
					// already normalized but no notes about it
					'MM2017-10-20_05h01m44s625.jpg': 'MM2018-11-21_06h00m45s627.jpg', // normalized name is lower as a source than primary hints
				}
				Object.keys(TEST_CASES).forEach(tc_key => {
					it(`should work = concatenate the date and meaningful part -- "${ tc_key }"`, () => {
						stategen.inputs.basenameⵧcurrent = tc_key
						// build confidence
						stategen.inputs.dateⵧexif = null //_get_exif_datetime(BCD)
						stategen.inputs.neighbor_hints__fs_reliability_shortcut = 'reliable'
						stategen.inputs.dateⵧfsⵧcurrent‿tms = get_timestamp_utc_ms_from(BCD)

						let state = stategen.create_state()

						const bcd_meta = get_best_creation_date‿meta(state)
						expect(bcd_meta.confidence).not.to.equal('junk')
						expect(
							get_ideal_basename(state, { requested_confidence: false }),
							'ideal basename'
						).to.equal(TEST_CASES[tc_key])
					})
				})
			})

			context('when encountering the file again', function () {

				// real bug encountered 2020/12/16
				const CURRENT_BASENAME = 'MM2019-07-31_21h00m15_screenshot.png'
				it(`should be stable = no change, even without authoritative EXIF`, () => {
					let state = create(CURRENT_BASENAME)
					const creation_date‿tms = 1564542022000
					state = on_info_read__fs_stats(state, {
						birthtimeMs: creation_date‿tms,
						atimeMs: creation_date‿tms + 10000, // TODO test with random
						mtimeMs: creation_date‿tms + 10000,
						ctimeMs: creation_date‿tms + 10000,
					})
					if (is_exif_powered_media_file(state))
						state = on_info_read__exif(state, {} as any)
					state = on_info_read__hash(state, '1234')
					const neighbor_hints = NeighborHintsLib.create()
					state = on_info_read__current_neighbors_primary_hints(state, neighbor_hints)

					state = on_notes_recovered(state, {
						currently_known_as: CURRENT_BASENAME,
						renaming_source: undefined,

						deleted: false,
						starred: false,
						manual_date: undefined,

						best_date_afawk_symd: undefined, // TODO test?

						historical: {
							basename: 'Capture d’écran 2019-07-31 à 21.00.15.png',
							parent_path: 'foo',
							fs_bcd_tms: creation_date‿tms,
							neighbor_hints: NeighborHintsLib.get_historical_representation(neighbor_hints, creation_date‿tms),
						}
					})
					expect(get_ideal_basename(state), CURRENT_BASENAME).to.equal(CURRENT_BASENAME)
				})
			})

			context('when the basename has a copy marker', function() {
				function get_test_state() {
					const CURRENT_BASENAME = 'foo - copie 3.png'
					let state = create(CURRENT_BASENAME)
					const creation_date‿tms = 1564542022000
					state = on_info_read__fs_stats(state, {
						birthtimeMs: creation_date‿tms,
						atimeMs: creation_date‿tms + 10000,
						mtimeMs: creation_date‿tms + 10000,
						ctimeMs: creation_date‿tms + 10000,
					})
					if (is_exif_powered_media_file(state))
						state = on_info_read__exif(state, {} as any)
					state = on_info_read__hash(state, '1234')
					state = on_info_read__current_neighbors_primary_hints(state, NeighborHintsLib.create())

					state = on_notes_recovered(state, null)

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
	})
})

/*
// TODO review
context.skip('when this basename is already processed -- current version', function() {
	beforeEach(() => {
		stategen.inputs.basenameⵧcurrent = `MM${REAL_CREATION_DATE‿HRTS}_hello.jpg`
		expect(is_normalized_media_basename(stategen.inputs.basenameⵧcurrent)).to.be.true
	})

	context('when NOT having a matching FS date', function() {
		beforeEach(() => {
			stategen.inputs.dateⵧfsⵧcurrent‿tms = BAD_CREATION_DATE_CANDIDATE‿TMS
		})

		it('should trust the previous run as primary and ignore FS', () => {
			let state = stategen.create_state()

			const bcdm = get_best_creation_date‿meta(state)
			expect(bcdm.source, 'source').to.equal('some_basename_p')
			expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal('2017-10-20_05h01m44s625')
			expect(bcdm.confidence, 'confidence').to.equal('primary')
			expect(bcdm.from_historical, 'origin').to.equal(false) // bc not original
			expect(bcdm.is_fs_matching, 'fs matching').to.be.false

			// final as integration
			expect(get_ideal_basename(state), 'ideal basename').to.equal('MM2017-10-20_05h01m44s625_hello.jpg')
		})
	})

	context('when having a matching FS date', function() {
		beforeEach(() => {
			stategen.inputs.dateⵧfsⵧcurrent‿tms = REAL_CREATION_DATE‿TMS
		})

		it('should trust the previous run as primary and ignore FS which cannot give us anything more', () => {
			let state = stategen.create_state()

			const bcdm = get_best_creation_date‿meta(state)
			expect(bcdm.source, 'source').to.equal('some_basename_p')
			expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal('2017-10-20_05h01m44s625')
			expect(bcdm.confidence, 'confidence').to.equal('primary')
			expect(bcdm.from_historical, 'origin').to.equal(false)
			expect(bcdm.is_fs_matching, 'fs matching').to.be.true

			// final as integration
			expect(get_ideal_basename(state), 'ideal basename').to.equal('MM2017-10-20_05h01m44s625_hello.jpg')
		})
	})
})

// TODO review
context.skip('when this basename is already processed -- older version', function() {
	beforeEach(() => {
		stategen.inputs.basenameⵧcurrent = `MM${REAL_CREATION_DATE‿HRTS}_hello.jpg`
	})

	context('when NOT having a matching FS date', function() {
		beforeEach(() => {
			stategen.inputs.dateⵧfsⵧcurrent‿tms = BAD_CREATION_DATE_CANDIDATE‿TMS
		})

		it('should trust the previous run as primary and ignore FS', () => {
			let state = stategen.create_state()

			const bcdm = get_best_creation_date‿meta(state)
			expect(bcdm.source, 'source').to.equal('some_basename_p')
			expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal('2017-10-20_05h01m44s625')
			expect(bcdm.confidence, 'confidence').to.equal('primary')
			expect(bcdm.from_historical, 'origin').to.equal(false) // bc not original
			expect(bcdm.is_fs_matching, 'fs matching').to.be.false

			// final as integration
			expect(get_ideal_basename(state), 'ideal basename').to.equal('MM2017-10-20_05h01m44s625_hello.jpg')
		})
	})

	context('when having a matching FS date', function() {
		beforeEach(() => {
			stategen.inputs.dateⵧfsⵧcurrent‿tms = REAL_CREATION_DATE‿TMS
		})

		it('should trust the previous run as primary and ignore FS which cannot give us anything more', () => {
			let state = stategen.create_state()

			const bcdm = get_best_creation_date‿meta(state)
			expect(bcdm.source, 'source').to.equal('some_basename_p')
			expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal('2017-10-20_05h01m44s625')
			expect(bcdm.confidence, 'confidence').to.equal('primary')
			expect(bcdm.from_historical, 'origin').to.equal(false)
			expect(bcdm.is_fs_matching, 'fs matching').to.be.true

			// final as integration
			expect(get_ideal_basename(state), 'ideal basename').to.equal('MM2017-10-20_05h01m44s625_hello.jpg')
		})
	})
})
*/
