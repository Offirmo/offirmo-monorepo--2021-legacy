import { expect } from 'chai'

import { LIB } from '../../consts'
import {
	get_best_creation_date,
	_get_best_creation_date‿compact,
	get_best_creation_date‿meta,
	get_best_creation_date__year,
	get_current_basename,
	get_current_parent_folder_id,
	get_ideal_basename,
	is_confident_in_date_enough_to__fix_fs,
	is_confident_in_date_enough_to__sort,
} from '.'
import {
	get_embedded_timezone,
	get_human_readable_timestamp_auto,
} from '../../services/better-date'
import { ALL_MEDIA_DEMOS } from '../../__test_shared/real_files'


import './__test_shared'

/////////////////////

describe(`${LIB} - file (state)`, function() {

	describe('integration', function() {

		describe('real files', function() {
			this.timeout(5000) // actual file loading and parsing

			ALL_MEDIA_DEMOS
				//.slice(5)
				.forEach(({ data: MEDIA_DEMO, get_phase1_state, get_phase2_state }, index) => {

				it(`should work up to phase 1 - #${index+1}: "${MEDIA_DEMO.BASENAME}"`, async () => {
					let state = await get_phase1_state()

					expect(get_current_basename(state)).to.equal(MEDIA_DEMO.BASENAME)
					expect(get_current_parent_folder_id(state)).to.equal('.')
				})

				it(`should work up to phase 2 - #${index+1}: "${MEDIA_DEMO.BASENAME}"`, async () => {
					let state = await get_phase2_state()

					expect(get_current_basename(state), 'current bn').to.equal(MEDIA_DEMO.BASENAME)
					expect(get_current_parent_folder_id(state), 'current parent').to.equal('.')

					expect(get_human_readable_timestamp_auto(get_best_creation_date(state), 'tz:embedded')).to.deep.equal(MEDIA_DEMO.DATE__HUMAN_AUTO)

					expect(get_best_creation_date__year(state), 'bcy').to.equal(MEDIA_DEMO.YEAR)
					expect(_get_best_creation_date‿compact(state), 'compact').to.equal(MEDIA_DEMO.DATE__COMPACT)
					expect(get_embedded_timezone(get_best_creation_date(state)), 'tz').to.deep.equal(MEDIA_DEMO.FINAL_TZ)

					const bcd_meta = get_best_creation_date‿meta(state)
					//console.log(bcd_meta)
					expect(bcd_meta.confidence, 'confidence').to.equal(MEDIA_DEMO.CONFIDENCE)
					expect(is_confident_in_date_enough_to__fix_fs(state)).to.equal(MEDIA_DEMO.CONFIDENCE === 'primary')
					expect(is_confident_in_date_enough_to__sort(state)).to.equal(MEDIA_DEMO.CONFIDENCE !== 'junk')

					expect(get_ideal_basename(state)).to.equal(MEDIA_DEMO.IDEAL_BASENAME)
				})
			})
		})
	})
})
