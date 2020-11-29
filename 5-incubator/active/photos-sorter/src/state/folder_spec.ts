import { expect } from 'chai'

import { LIB } from '../consts'
import {
	State,

	is_current_name_intentful,
	get_ideal_basename,

	create,
	on_subfile_found,
} from './folder'

import {
	get_MEDIA_DEMO_01
} from '../__test_shared/real_files'

/////////////////////


describe(`${LIB} - folder state`, function() {

	describe('selectors', function() {

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
					if (!state.begin_date)
						state.begin_date = state.end_date = 20001231
					//console.log(state)
					expect(get_ideal_basename(state), tc).to.equal(TEST_CASES[tc])
				})
			})

			it('should priorise explicit date over basename hint', () => {
				let state: State = create('20140803 - holidays')
				//console.log(state)
				state.begin_date = state.end_date = 20001231
				//console.log(state)
				expect(get_ideal_basename(state)).to.equal('20001231 - holidays')
			})
		})
	})

	describe('reducers', function() {

		describe('create()', function () {

			it('should infer the date range', () => {
				let state = create('holiday 2018-09-04')
				expect(state.begin_date, 'inferred begin').to.equal(20180904)
				expect(state.end_date, 'inferred end').to.equal(20180904)
			})
		})

		describe('on_subfile_found()', function () {
			before(() => get_MEDIA_DEMO_01())

			context('when no range', function() {

				it('should set the date range', async () => {
					let state = create('foo')

					let file_state = await get_MEDIA_DEMO_01()
					state = on_subfile_found(state, file_state)

					expect(state.type).to.equal('event')
					expect(state.begin_date).to.equal(20180903)
					expect(state.end_date).to.equal(20180903)
				})
			})

			context('when existing range', function() {

				it('should extend the begin date', async () => {
					let state = create('holiday 20180904')
					expect(state.begin_date, 'inferred begin').to.equal(20180904)
					expect(state.end_date, 'inferred end').to.equal(20180904)

					let file_state = await get_MEDIA_DEMO_01()
					state = on_subfile_found(state, file_state)

					expect(state.type).to.equal('event')
					expect(state.begin_date).to.equal(20180903)
					expect(state.end_date).to.equal(20180904)
				})

				it('should NOT extend the begin date range if the folder name is clear on the begin date', async () => {
					let state = create('20180904 - holiday')
					expect(state.begin_date).to.equal(20180904)
					expect(state.end_date).to.equal(20180904)
					expect(is_current_name_intentful(state)).to.be.true

					let file_state = await get_MEDIA_DEMO_01()
					state = on_subfile_found(state, file_state)

					expect(state.type).to.equal('event')
					expect(state.begin_date).to.equal(20180904)
					expect(state.end_date).to.equal(20180904)
				})

				it('should extend the end date range', async () => {
					let state = create('20180902 - holiday')
					expect(state.begin_date).to.equal(20180902)
					expect(state.end_date).to.equal(20180902)

					let file_state = await get_MEDIA_DEMO_01()
					state = on_subfile_found(state, file_state)

					expect(state.type).to.equal('event')
					expect(state.begin_date).to.equal(20180902)
					expect(state.end_date).to.equal(20180903)
				})
			})

			context('when the range gets too big', function() {

				context('when not intentful', function() {

					it('should demote', async () => {
						let state = create('holiday 20180704')

						let file_state = await get_MEDIA_DEMO_01()
						state = on_subfile_found(state, file_state)

						expect(state.type).to.equal('unknown') // demoted
						expect(state.begin_date).to.equal(20180704)
						expect(state.end_date).to.equal(20180704)
					})
				})

				context('when intentful', function() {

					it('should not demote but cap the range', async () => {
						let state = create('20180704 - holiday')

						let file_state = await get_MEDIA_DEMO_01()
						state = on_subfile_found(state, file_state)

						expect(state.type).to.equal('event')
						expect(state.begin_date).to.equal(20180704)
						expect(state.end_date).to.equal(20180801)
					})
				})
			})
		})
	})

})
