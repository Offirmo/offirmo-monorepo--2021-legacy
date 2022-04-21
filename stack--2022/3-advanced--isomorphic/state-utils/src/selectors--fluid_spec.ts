import { expect } from 'chai'

import { LIB } from './consts'

import {
	fluid_select
} from './selectors--fluid'

import {
	DEMO_USTATE,
	DEMO_BASE_STATE,
	DEMO_BASE_STATE_WITH_SUBS,
	DEMO_TSTATE,
	DEMO_ROOT_STATE,
} from './_test_helpers'


describe(`${LIB} - FLUID selectors`, function() {

	describe('has_higher_investment_than()', function() {

		context('on semantic equality', function() {

			it('should select the selected', () => {

				const existing = DEMO_ROOT_STATE
				const candidate = {
					...DEMO_ROOT_STATE,
				}
				expect(fluid_select(candidate).has_higher_investment_than(existing)).to.be.true
				expect(fluid_select(existing).has_higher_investment_than(candidate)).to.be.true
			})
		})

		context('on nominal case of increasing revisions', function() {

			it('should select the highest revision', () => {

				const existing = DEMO_ROOT_STATE
				const candidate = {
					...DEMO_ROOT_STATE,
					u_state: {
						...DEMO_ROOT_STATE.u_state,
						revision: DEMO_ROOT_STATE.u_state.revision + 1,
					},
				}
				expect(fluid_select(candidate).has_higher_investment_than(existing)).to.be.true
				expect(fluid_select(existing).has_higher_investment_than(candidate)).to.be.false
			})
		})

		context('on fork case', function() {

			it('should select the version with most recent involvement', () => {

				const existing = DEMO_ROOT_STATE
				const candidate = {
					...DEMO_ROOT_STATE,
					last_user_investment_tms: DEMO_ROOT_STATE.last_user_investment_tms + 10,
				}
				expect(fluid_select(candidate).has_higher_investment_than(existing)).to.be.true
				expect(fluid_select(existing).has_higher_investment_than(candidate)).to.be.false
			})
		})

		context('on tricky case of reverse version vs. revision', function() {

			it('should select the lower schema version with higher involvement', () => {

				const existing = DEMO_ROOT_STATE
				const candidate = {
					...DEMO_ROOT_STATE,
					u_state: {
						...DEMO_ROOT_STATE.u_state,
						schema_version: DEMO_ROOT_STATE.u_state.schema_version - 1,
						revision: DEMO_ROOT_STATE.u_state.revision + 1,
					},
					t_state: {
						...DEMO_ROOT_STATE.t_state,
						schema_version: DEMO_ROOT_STATE.t_state.schema_version - 1,
						//revision: DEMO_ROOT_STATE.t_state.revision + 1,
					},
				}
				expect(fluid_select(candidate).has_higher_investment_than(existing)).to.be.true
				expect(fluid_select(existing).has_higher_investment_than(candidate)).to.be.false
			})
		})
	})

	describe('has_valuable_difference_with', function() {


	})
})
