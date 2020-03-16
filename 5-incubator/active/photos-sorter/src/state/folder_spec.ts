import { expect } from 'chai'

import { LIB } from '../consts'
import {
	State,
	create,
	get_ideal_basename,
} from './folder'

/////////////////////


describe(`${LIB} - folder state`, function() {

	describe('get_ideal_basename', function () {

		it('should work', () => {
			type TCIdeal = { [k: string]: string }
			const TEST_CASES: TCIdeal = {
				'foo': '20001231 - foo',
				'20140803 - holidays': '20140803 - holidays',
				'- inbox': '- inbox',
			}
			Object.keys(TEST_CASES).forEach(tc => {
				let state: State = create(tc)
				if (!state.start_date)
					state.start_date = state.end_date = 20001231
				//console.log(state)
				expect(get_ideal_basename(state), tc).to.equal(TEST_CASES[tc])
			})
		})

		it('should priorise explicit date over basename hint', () => {
			let state: State = create('20140803 - holidays')
			//console.log(state)
			state.start_date = state.end_date = 20001231
			//console.log(state)
			expect(get_ideal_basename(state)).to.equal('20001231 - holidays')
		})
	})
})
