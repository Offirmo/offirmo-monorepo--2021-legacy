import { expect } from 'chai'

import { LIB } from '../consts'
import {
	create,
	get_ideal_basename,
} from './media-file'
import {starts_with_human_timestamp_ms} from '../services/matchers'

/////////////////////

type TCIdeal = { [k: string]: string }

describe(`${LIB} - media file state`, function() {

	describe.only('get_ideal_basename', function () {

		it('should work', () => {
			const TEST_CASES: TCIdeal = {
				'P1000010.JPG': '20181121_06h00+45-P1000010.jpg', // stupid prehistoric phone
				'IMG_3211.JPG': '20181121_06h00+45-IMG_3211.jpg', // typical Apple
				'TR81801414546EGJ.jpg': '20181121_06h00+45-TR81801414546EGJ.jpg', // lot of digits but not a date
				'IMG_20130525.JPG': 'IMG_20130525.jpg', // TODO typical Android
				'20180603_taronga_vivd.gif': '20180603_taronga_vivd.gif', // already has a date, don't touch
				'20170303_12h00+45.632.jpg': '20170303_12h00+45.632.jpg', // already formatted by us, don't touch
			}
			Object.keys(TEST_CASES).forEach(tc => {
				//console.log( { tc, x: TEST_CASES[tc], m: tc.match(YEAR_RE) } )
				const state = create(tc)
				state.cached.best_creation_date_ms = 1542780045627
				expect(get_ideal_basename(state), tc).to.equal(TEST_CASES[tc])
			})
		})
	})
})
