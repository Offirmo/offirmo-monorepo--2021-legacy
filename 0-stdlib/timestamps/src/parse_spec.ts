import { expect } from 'chai'

import {
	get_human_readable_UTC_timestamp_ms,
	parse_human_readable_UTC_timestamp_ms,
} from '.'

//declare const console: any

describe('@offirmo-private/timestamps', function() {

	describe('parse_human_readable_UTC_timestamp_ms()', function() {

		it('should correctly parse corresponding timestamps', function() {
			for(let i = 0; i < 10; ++i) {

				const date = new Date(1510177449000 + i * 1000000000)
				date.setMilliseconds(i*100 + i*10 + i)
				const stamp = get_human_readable_UTC_timestamp_ms(date)
				//console.log(stamp)
				const date_back = parse_human_readable_UTC_timestamp_ms(stamp)

				expect(date_back).to.deep.equal(date)
			}
		})
	})
})
