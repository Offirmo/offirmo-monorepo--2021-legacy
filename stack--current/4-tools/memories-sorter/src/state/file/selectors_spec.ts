import { expect } from 'chai'
import { Immutable } from '@offirmo-private/ts-types'

import { LIB } from '../../consts'
import {
	create_better_date,
	get_human_readable_timestamp_auto,
	get_timestamp_utc_ms_from,
} from '../../services/better-date'
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
import * as NeighborHintsLib from './sub/neighbor-hints'

import {
	get_test_single_file_state_generator,
	REAL_CREATION_DATE,
	REAL_CREATION_DATE‿EXIF,
	REAL_CREATION_DATE‿TMS,
	REAL_CREATION_DATE‿HRTS,
	BAD_CREATION_DATE_CANDIDATE‿TMS,
	BAD_CREATION_DATE_CANDIDATE‿HRTS,
} from '../../__test_shared/utils'
import './__test_shared'

/////////////////////

describe(`${LIB} - file (state)`, function() {

	describe('selectors', function() {

		describe('get_best_creation_date()', function() {
			const DEBUG = false
			let stategen = get_test_single_file_state_generator()
			beforeEach(() => stategen.reset())
			beforeEach(() => DEBUG && console.log('-------'))

			context('when encountering the file for the 1st time == NOT having notes incl. historical data', function() {

				function expect_second_encounter_to_be_stable(
					mode: 're-encounter--same' | 're-encounter--after_loss',
					//expected_bcd_source?: undefined | BestCreationDate['source'],
					first_encounter_stategen: ReturnType<typeof get_test_single_file_state_generator> = stategen
				) {
					const first_encounter_final_state = first_encounter_stategen.create_state()
					const bcdm_1st_encounter = get_best_creation_date‿meta(first_encounter_final_state)
					const notes_from_first_encounter = JSON.parse(JSON.stringify(first_encounter_final_state.notes))

					switch (mode) {
						case 're-encounter--same': {
							// re-encountering in-place, no change
							DEBUG && console.log('--- R.E. #1')
							const stategen = get_test_single_file_state_generator(first_encounter_stategen)
							stategen.inputs.notes = notes_from_first_encounter
							const state = stategen.create_state()

							const bcdmⵧoldest = get_best_creation_dateⵧfrom_oldest_known_data‿meta(state)
							expect(bcdmⵧoldest.source, 'O same source as 1st encounter (1)')
								.to.equal(bcdm_1st_encounter.source.replaceAll('current', 'oldest'))

							const bcdmⵧcurrent = get_best_creation_dateⵧfrom_current_data‿meta(state)
							expect(bcdmⵧcurrent.source, 'C same source as 1st encounter (1)')
								.to.equal(bcdm_1st_encounter.source.replaceAll('oldest', 'current'))

							const bcdm = get_best_creation_date‿meta(state)
							expect(bcdm.source, 'same source as 1st encounter (1)')
								.to.equal(bcdm_1st_encounter.source)

							break
						}

						case 're-encounter--after_loss': {
							// re-encountering when everything has changed
							DEBUG && console.log('--- R.E. #2')
							const stategen = get_test_single_file_state_generator()
							stategen.inputs.parent_pathⵧcurrent‿relative = 'lost'
							stategen.inputs.basenameⵧcurrent = 'lost.jpeg'
							stategen.inputs.dateⵧfsⵧcurrent‿tms = BAD_CREATION_DATE_CANDIDATE‿TMS
							stategen.inputs.dateⵧexif = first_encounter_stategen.inputs.dateⵧexif
							stategen.inputs.hashⵧcurrent = 'lost'
							stategen.inputs.neighbor_hints__fs_reliability_shortcut = 'unreliable'
							stategen.inputs.notes = notes_from_first_encounter
							const state = stategen.create_state()

							const bcdmⵧoldest = get_best_creation_dateⵧfrom_oldest_known_data‿meta(state)
							expect(bcdmⵧoldest.source, 'O same source as 1st encounter (2)')
								.to.equal(bcdm_1st_encounter.source.replaceAll('current', 'oldest'))

							// no need to compare current, voided by lost data

							const bcdm = get_best_creation_date‿meta(state)
							expect(bcdm.source, 'same source as 1st encounter (2)')
								.to.equal(bcdm_1st_encounter.source.replaceAll('current', 'oldest')) // since data loss, source should come from oldest

							break
						}

						default:
							throw new Error('expect_second_encounter_to_be_stable() switch default!')
					}
				}

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
						expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal(REAL_CREATION_DATE‿HRTS)
						expect(bcdm.confidence, 'confidence').to.equal('primary')
						expect(bcdm.is_fs_matching, 'fs matching').to.be.false

						// final as integration
						expect(get_ideal_basename(state), 'ideal basename').to.equal(`MM${REAL_CREATION_DATE‿HRTS}_bar.jpg`)
					})

					context('when encountering the file for the second time', function () {

						context('as exactly the same', function() {

							it('should come up with the same BCD', () => {
								expect_second_encounter_to_be_stable('re-encounter--same')
							})
						})

						context('with a lot of information lost', function () {

							it('should come up with the same BCD', () => {
								expect_second_encounter_to_be_stable('re-encounter--after_loss')
							})
						})
					})
				})

				context('when NOT having any EXIF date', function() {

					beforeEach(() => {
						stategen.inputs.dateⵧexif = null
					})

					context('when having a date from a NP basename', function() {

						beforeEach(() => {
							stategen.inputs.basenameⵧcurrent = 'IMG_20030313_2333.jpg' // should match REAL_CREATION_DATE
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
								expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal(REAL_CREATION_DATE‿HRTS)
								expect(bcdm.confidence, 'confidence').to.equal('primary')
								expect(bcdm.from_historical, 'origin').to.equal(true)
								expect(bcdm.is_fs_matching, 'fs matching').to.be.true

								// final as integration
								expect(get_ideal_basename(state), 'ideal basename').to.equal(`MM${REAL_CREATION_DATE‿HRTS}.jpg`)
							})

							context('when encountering the file for the second time', function () {

								context('as exactly the same', function() {

									it('should come up with the same BCD', () => {
										expect_second_encounter_to_be_stable('re-encounter--same')
									})
								})

								context('with a lot of information lost', function () {

									it('should come up with the same BCD', () => {
										expect_second_encounter_to_be_stable('re-encounter--after_loss')
									})
								})
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
									expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal(REAL_CREATION_DATE‿HRTS.slice(0, 16))
									expect(bcdm.confidence, 'confidence').to.equal('primary')
									expect(bcdm.from_historical, 'origin').to.equal(true)
									expect(bcdm.is_fs_matching, 'fs matching').to.be.false

									// final as integration
									expect(get_ideal_basename(state), 'ideal basename').to.equal(`MM${REAL_CREATION_DATE‿HRTS.slice(0, 16)}.jpg`)
								})

							context('when encountering the file for the second time', function () {

								context('as exactly the same', function() {

									it('should come up with the same BCD', () => {
										expect_second_encounter_to_be_stable('re-encounter--same')
									})
								})

								context('with a lot of information lost', function () {

									it('should come up with the same BCD', () => {
										expect_second_encounter_to_be_stable('re-encounter--after_loss')
									})
								})
							})
						})
					})

					context('when NOT having a date from a NP basename', function () {

						context('when neighbour hints estimates FS reliability as: reliable', function() {
							beforeEach(() => {
								stategen.inputs.neighbor_hints__fs_reliability_shortcut = 'reliable'
								stategen.inputs.dateⵧfsⵧcurrent‿tms = REAL_CREATION_DATE‿TMS
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

								const bcdm = get_best_creation_date‿meta(state)
								expect(bcdm.source, 'source').to.equal('fsⵧoldest+neighbor✔')
								expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal(REAL_CREATION_DATE‿HRTS)
								expect(bcdm.confidence, 'confidence').to.equal('primary')
								expect(bcdm.is_fs_matching, 'fs matching').to.be.true

								// final as integration
								expect(get_ideal_basename(state), 'ideal basename').to.equal(`MM${REAL_CREATION_DATE‿HRTS}_bar.jpg`)
							})

							context('when encountering the file for the second time', function () {

								context('as exactly the same', function() {

									it('should come up with the same BCD', () => {
										expect_second_encounter_to_be_stable('re-encounter--same')
									})
								})

								context('with a lot of information lost', function () {

									it('should come up with the same BCD', () => {
										expect_second_encounter_to_be_stable('re-encounter--after_loss')
									})
								})
							})
						})

						context('when neighbour hints estimates FS reliability as: unknown', function() {

							beforeEach(() => {
								stategen.inputs.neighbor_hints__fs_reliability_shortcut = 'unknown'
								//stategen.inputs.dateⵧfsⵧcurrent‿tms = BAD_CREATION_DATE_CANDIDATE‿TMS
							})

							context('when having a date from a P basename', function() {

								beforeEach(() => {
									stategen.inputs.basenameⵧcurrent = `MM${REAL_CREATION_DATE‿HRTS}_bar.jpg`
								})

								it('should use the basename date', () => {
									// justification: if the parent folder has a date, means it strongly looks like an event
									// = implies that the PRIMARY children is matching
									// hence the file must have been manually sorted = must stay here
									// however it's a secondary
									let state = stategen.create_state()

									const bcdmⵧoldest = get_best_creation_dateⵧfrom_oldest_known_data‿meta(state)
									expect(bcdmⵧoldest.source, 'oldest.source').to.equal('basename_pⵧoldest')

									const bcdmⵧcurrent = get_best_creation_dateⵧfrom_current_data‿meta(state)
									expect(bcdmⵧcurrent.source, 'current.source').to.equal('basename_pⵧcurrent')

									expect(bcdmⵧoldest.source.replaceAll('oldest', 'xxx'), 'O+C same source on 1st encounter')
										.to.equal(bcdmⵧcurrent.source.replaceAll('current', 'xxx'))
									expect(get_human_readable_timestamp_auto(bcdmⵧoldest.candidate, 'tz:embedded'), 'O+C same date on 1st encounter')
										.to.equal(get_human_readable_timestamp_auto(bcdmⵧcurrent.candidate, 'tz:embedded'))

									const bcdm = get_best_creation_date‿meta(state)
									expect(bcdm.source, 'source').to.equal('basename_pⵧcurrent') // secondary = current now has precedence to stay in same folder
									expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal(REAL_CREATION_DATE‿HRTS)
									expect(bcdm.confidence, 'confidence').to.equal('secondary')
									expect(bcdm.is_fs_matching, 'fs matching').to.be.false

									// final as integration
									expect(get_ideal_basename(state), 'ideal basename').to.equal(`MM${REAL_CREATION_DATE‿HRTS}_bar.jpg`) // no change
								})

								context('when encountering the file for the second time', function () {

									context('as exactly the same', function() {

										it('should come up with the same BCD', () => {
											expect_second_encounter_to_be_stable('re-encounter--same')
										})
									})

									context('with a lot of information lost', function () {

										it('should come up with the same BCD', () => {
											expect_second_encounter_to_be_stable(
												're-encounter--after_loss',
												//'basename_pⵧoldest', // TODO review
											)
										})
									})
								})
							})

							context('when NOT having a date from a P basename', function() {

								beforeEach(() => {
									stategen.inputs.dateⵧfsⵧcurrent‿tms = REAL_CREATION_DATE‿TMS
								})

								it('should use fs date but NOT great confidence', () => {
									// justification: if the parent folder has a date, means it strongly looks like an event
									// = implies that the PRIMARY children is matching
									// hence the file must have been manually sorted = must stay here
									// however it's a secondary
									let state = stategen.create_state()

									const bcdmⵧoldest = get_best_creation_dateⵧfrom_oldest_known_data‿meta(state)
									expect(bcdmⵧoldest.source, 'oldest.source').to.equal('fsⵧoldest+neighbor?')

									const bcdmⵧcurrent = get_best_creation_dateⵧfrom_current_data‿meta(state)
									expect(bcdmⵧcurrent.source, 'current.source').to.equal('fsⵧcurrent+neighbor?')

									expect(bcdmⵧoldest.source.replaceAll('oldest', 'xxx'), 'O+C same source on 1st encounter')
										.to.equal(bcdmⵧcurrent.source.replaceAll('current', 'xxx'))
									expect(get_human_readable_timestamp_auto(bcdmⵧoldest.candidate, 'tz:embedded'), 'O+C same date on 1st encounter')
										.to.equal(get_human_readable_timestamp_auto(bcdmⵧcurrent.candidate, 'tz:embedded'))

									const bcdm = get_best_creation_date‿meta(state)
									expect(bcdm.source, 'source').to.equal('fsⵧcurrent+neighbor?')
									expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal(REAL_CREATION_DATE‿HRTS)
									expect(bcdm.confidence, 'confidence').to.equal('secondary')
									expect(bcdm.is_fs_matching, 'fs matching').to.be.true // obviously

									// final as integration
									expect(get_ideal_basename(state), 'ideal basename').to.equal('bar.jpg') // no renaming since no confidence
								})

								context('when encountering the file for the second time', function () {

									context('as exactly the same', function() {

										it('should come up with the same BCD', () => {
											expect_second_encounter_to_be_stable('re-encounter--same')
										})
									})

									context('with a lot of information lost', function () {

										it('should come up with the same BCD', () => {
											expect_second_encounter_to_be_stable('re-encounter--after_loss')
										})
									})
								})
							})
						})

						context('when neighbour hints estimates FS reliability as: unreliable', function() {

							beforeEach(() => {
								stategen.inputs.neighbor_hints__fs_reliability_shortcut = 'unreliable'
							})

							context('when having a date from a P basename', function() {

								beforeEach(() => {
									stategen.inputs.basenameⵧcurrent = `MM${REAL_CREATION_DATE‿HRTS}_bar.jpg`
								})

								it('should use the basename date', () => {
									// justification: if the parent folder has a date, means it strongly looks like an event
									// = implies that the PRIMARY children is matching
									// hence the file must have been manually sorted = must stay here
									// however it's a secondary
									let state = stategen.create_state()

									const bcdmⵧoldest = get_best_creation_dateⵧfrom_oldest_known_data‿meta(state)
									expect(bcdmⵧoldest.source, 'oldest.source').to.equal('basename_pⵧoldest')

									const bcdmⵧcurrent = get_best_creation_dateⵧfrom_current_data‿meta(state)
									expect(bcdmⵧcurrent.source, 'current.source').to.equal('basename_pⵧcurrent')

									expect(bcdmⵧoldest.source.replaceAll('oldest', 'xxx'), 'O+C same source on 1st encounter')
										.to.equal(bcdmⵧcurrent.source.replaceAll('current', 'xxx'))
									expect(get_human_readable_timestamp_auto(bcdmⵧoldest.candidate, 'tz:embedded'), 'O+C same date on 1st encounter')
										.to.equal(get_human_readable_timestamp_auto(bcdmⵧcurrent.candidate, 'tz:embedded'))

									const bcdm = get_best_creation_date‿meta(state)
									expect(bcdm.source, 'source').to.equal('basename_pⵧcurrent') // secondary = current now has precedence to stay in same folder
									expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal(REAL_CREATION_DATE‿HRTS)
									expect(bcdm.confidence, 'confidence').to.equal('secondary')
									expect(bcdm.is_fs_matching, 'fs matching').to.be.false

									// final as integration
									expect(get_ideal_basename(state), 'ideal basename').to.equal(`MM${REAL_CREATION_DATE‿HRTS}_bar.jpg`) // no change
								})

								context('when encountering the file for the second time', function () {

									context('as exactly the same', function() {

										it('should come up with the same BCD', () => {
											expect_second_encounter_to_be_stable('re-encounter--same')
										})
									})

									context('with a lot of information lost', function () {

										it('should come up with the same BCD', () => {
											expect_second_encounter_to_be_stable('re-encounter--after_loss')
										})
									})
								})
							})

							context('when NOT having a date from a P basename', function() {

								context('when having a date from parent folder', function () {
									// justification: if the parent folder has a date, means it strongly looks like an event
									// = implies that the PRIMARY children is matching
									// hence the file must have been manually sorted = must stay here
									// however it's a secondary

									beforeEach(() => {
										stategen.inputs.neighbor_hints__junk_bcd = REAL_CREATION_DATE
										/*console.log({
											current_neighbor_hints: NeighborHintsLib.get_debug_representation(stategen.create_state().current_neighbor_hints),
										})*/
									})

									it('should use the parent folder date', () => {
										let state = stategen.create_state()
										expect(state.current_neighbor_hints?.fallback_junk_bcd, 'prereq').not.to.be.undefined // check prerequisite

										const bcdmⵧoldest = get_best_creation_dateⵧfrom_oldest_known_data‿meta(state)
										expect(bcdmⵧoldest.source, 'oldest.source').to.equal('parentⵧoldest')

										const bcdmⵧcurrent = get_best_creation_dateⵧfrom_current_data‿meta(state)
										expect(bcdmⵧcurrent.source, 'current.source').to.equal('parentⵧcurrent')

										expect(bcdmⵧoldest.source.replaceAll('oldest', 'xxx'), 'O+C same source on 1st encounter')
											.to.equal(bcdmⵧcurrent.source.replaceAll('current', 'xxx'))
										expect(get_human_readable_timestamp_auto(bcdmⵧoldest.candidate, 'tz:embedded'), 'O+C same date on 1st encounter')
											.to.equal(get_human_readable_timestamp_auto(bcdmⵧcurrent.candidate, 'tz:embedded'))

										const bcdm = get_best_creation_date‿meta(state)
										expect(bcdm.source, 'source').to.equal('parentⵧcurrent')
										expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal(REAL_CREATION_DATE‿HRTS)
										expect(bcdm.confidence, 'confidence').to.equal('secondary')
										expect(bcdm.is_fs_matching, 'fs matching').to.be.false // obviously

										// final as integration
										expect(get_ideal_basename(state), 'ideal basename').to.equal('bar.jpg') // no renaming since no confidence
									})

									context('when encountering the file for the second time', function () {

										context('as exactly the same', function () {

											it('should come up with the same BCD', () => {
												expect_second_encounter_to_be_stable('re-encounter--same')
											})
										})

										context('with a lot of information lost', function () {

											it('should come up with the same BCD', () => {
												expect_second_encounter_to_be_stable('re-encounter--after_loss')
											})
										})
									})

								})

								context('when NOT having a date from parent folder', function () {

									it('should use fs date but NOT great confidence', () => {
										// justification: if the parent folder has a date, means it strongly looks like an event
										// = implies that the PRIMARY children is matching
										// hence the file must have been manually sorted = must stay here
										// however it's a secondary
										let state = stategen.create_state()
										expect(state.current_neighbor_hints?.fallback_junk_bcd, 'prereq').to.be.undefined // check prerequisite

										const bcdmⵧoldest = get_best_creation_dateⵧfrom_oldest_known_data‿meta(state)
										expect(bcdmⵧoldest.source, 'oldest.source').to.equal('fsⵧoldest+neighbor✖')

										const bcdmⵧcurrent = get_best_creation_dateⵧfrom_current_data‿meta(state)
										expect(bcdmⵧcurrent.source, 'current.source').to.equal('fsⵧcurrent+neighbor✖')

										expect(bcdmⵧoldest.source.replaceAll('oldest', 'xxx'), 'O+C same source on 1st encounter')
											.to.equal(bcdmⵧcurrent.source.replaceAll('current', 'xxx'))
										expect(get_human_readable_timestamp_auto(bcdmⵧoldest.candidate, 'tz:embedded'), 'O+C same date on 1st encounter')
											.to.equal(get_human_readable_timestamp_auto(bcdmⵧcurrent.candidate, 'tz:embedded'))

										const bcdm = get_best_creation_date‿meta(state)
										expect(bcdm.source, 'source').to.equal('fsⵧoldest+neighbor✖')
										expect(get_human_readable_timestamp_auto(bcdm.candidate, 'tz:embedded'), 'date hr').to.equal(BAD_CREATION_DATE_CANDIDATE‿HRTS)
										expect(bcdm.confidence, 'confidence').to.equal('junk')
										expect(bcdm.is_fs_matching, 'fs matching').to.be.true // obviously

										// final as integration
										expect(get_ideal_basename(state), 'ideal basename').to.equal('bar.jpg') // no renaming since no confidence
									})

									context('when encountering the file for the second time', function () {

										context('as exactly the same', function () {

											it('should come up with the same BCD', () => {
												expect_second_encounter_to_be_stable('re-encounter--same')
											})
										})

										context('with a lot of information lost', function () {

											it('should come up with the same BCD', () => {
												expect_second_encounter_to_be_stable('re-encounter--after_loss')
											})
										})
									})
								})
							})
						})
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

						context('when having a date in the ORIGINAL basename -- NON processed', function() {

							context('when having a date in the CURRENT basename', function() {

								context('when the CURRENT basename is already normalized and valid', function() {

									context('real bug encountered 2020/12/16', function() {
										beforeEach(() => {
											// = GMT: Wednesday, 31 July 2019 3:00:22 AM
											// not exact match but within acceptable range of a tz difference
											stategen.inputs.autoǃdate__fs_ms__historical = 1564542022000
											stategen.inputs.autoǃbasename__historical = 'Capture d’écran 2019-07-31 à 21.00.15.png'
											stategen.inputs.basenameⵧcurrent = 'MM2019-07-31_21h00m15_screenshot.png' // perfectly matching
											stategen.inputs.dateⵧfsⵧcurrent‿tms = stategen.inputs.autoǃdate__fs_ms__historical // TODO test with random
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
						_currently_known_as: CURRENT_BASENAME,
						_bcd_afawk‿symd: undefined,
						_bcd_source: undefined,

						deleted: false,
						starred: false,
						manual_date: undefined,


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
