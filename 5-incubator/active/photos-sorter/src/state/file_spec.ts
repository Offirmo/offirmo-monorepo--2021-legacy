import { expect } from 'chai'

import { LIB } from '../consts'
import {
	create,
	get_ideal_basename,
} from './file'

/////////////////////


describe(`${LIB} - media file state`, function() {

	describe('get_ideal_basename', function () {

		it('should concatenate the date and meaningful part', () => {
			type TCIdeal = { [k: string]: string }
			const TEST_CASES: TCIdeal = {
				'P1000010.JPG': 'M2018-11-21_06h00m45s627_P1000010.jpg', // stupid prehistoric phone
				'IMG_3211.JPG': 'M2018-11-21_06h00m45s627_IMG_3211.jpg', // typical Apple
				'TR81801414546EGJ.jpg': 'M2018-11-21_06h00m45s627_TR81801414546EGJ.jpg', // lot of digits but not a date
				'IMG_20130525.JPG': 'M2018-11-21_06h00m45s627.jpg', // TODO typical Android
				'20180603_taronga_vivd.gif': 'M2018-11-21_06h00m45s627_taronga_vivd.gif', // already has a date, don't touch
				'M2017-10-20_05h01m44s625.jpg': 'M2018-11-21_06h00m45s627.jpg',
			}
			Object.keys(TEST_CASES).forEach(tc => {
				const state = create(tc)
				state.cached.best_creation_date_ms = 1542780045627
				expect(get_ideal_basename(state), tc).to.equal(TEST_CASES[tc])
			})
		})
	})
})
