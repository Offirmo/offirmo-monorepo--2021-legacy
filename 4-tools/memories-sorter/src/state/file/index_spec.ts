import { expect } from 'chai'

import { LIB } from '../../consts'
import {
	get_best_creation_date,
	get_best_creation_date_compact,
	get_best_creation_date_meta,
	get_best_creation_year,
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


/////////////////////

describe(`${LIB} - file (state)`, function() {

	describe('integration', function() {

		describe('real files', function() {
			this.timeout(5000) // actual file loading and parsing

			ALL_MEDIA_DEMOS.forEach(({ data: MEDIA_DEMO, get_phase1_state }, index) => {
				it(`should work - #${index+1}: "${MEDIA_DEMO.BASENAME}"`, async () => {
					let state = await get_phase1_state()

					expect(get_current_basename(state)).to.equal(MEDIA_DEMO.BASENAME)
					expect(get_current_parent_folder_id(state)).to.equal('.')

					expect(get_human_readable_timestamp_auto(get_best_creation_date(state), 'tz:embedded')).to.deep.equal(MEDIA_DEMO.DATE__HUMAN_AUTO)

					expect(get_best_creation_year(state)).to.equal(MEDIA_DEMO.YEAR)
					expect(get_best_creation_date_compact(state)).to.equal(MEDIA_DEMO.DATE__COMPACT)
					expect(get_embedded_timezone(get_best_creation_date(state))).to.deep.equal(MEDIA_DEMO.FINAL_TZ)

					expect(get_best_creation_date_meta(state).confidence).to.equal(MEDIA_DEMO.CONFIDENCE)
					expect(is_confident_in_date_enough_to__fix_fs(state)).to.equal(MEDIA_DEMO.CONFIDENCE === 'primary')
					expect(is_confident_in_date_enough_to__sort(state)).to.equal(MEDIA_DEMO.CONFIDENCE !== 'junk')

					expect(get_ideal_basename(state)).to.equal(MEDIA_DEMO.IDEAL_BASENAME)
				})
			})
		})
	})
})
