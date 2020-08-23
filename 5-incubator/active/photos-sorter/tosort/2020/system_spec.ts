import { expect } from 'chai'

import {
	get_human_readable_timestamp_auto_no_tz
} from '../date_generator'

describe('system', function() {

	describe('timezone', function () {

		it('should work as expected', () => {
			const date = new Date(2019,11,16,20,38,8,123)
			console.log({
				date,
				toDateString: date.toDateString(),
				toISOString: date.toISOString(),
				toJSON: date.toJSON(),
				toLocaleDateString: date.toLocaleDateString(),
				toLocaleString: date.toLocaleString(),
				toLocaleTimeString: date.toLocaleTimeString(),
				toString: date.toString(),
				toTimeString: date.toTimeString(),
				toUTCString: date.toUTCString(),
				getHours: date.getHours(),
				get_human_readable_timestamp_auto_no_tz: get_human_readable_timestamp_auto_no_tz(date),
			})
			const iso = date.toISOString()
			expect(iso).to.equal('2019-12-16T20:38:08.123Z')
		})
	})
})
