import { expect } from 'chai'
import { Enum } from 'typescript-string-enums'

import { LIB } from '../consts'

import { createExperiment } from '.'
import {Cohort} from "../types";

function assert_react_API_shape(result: Readonly<any>) {
	expect(result.cohort).to.be.a('string')
	expect(Enum.isType(Cohort, result.cohort)).to.be.true

	expect(result.isEligible).to.be.a('boolean')

	expect(result.ineligibilityReasons).to.be.an('array')
	result.ineligibilityReasons.forEach((reason: string, index: number) => {
		expect(reason, `reason#${index}`).to.be.a('string')
	})
}

describe(`${LIB} - sugar API`, function() {

	describe('resolve()', function () {

		context('on a trivial experiment', function () {
			it('should always work', () => {
				const experiment = createExperiment('FOO-123/trivial')
					.withCohortPicker(() => Cohort['variation'])

				return experiment.resolve()
					.then(assert_react_API_shape)
			})
		})

		context('on an incorrect experiment - cohort picker throwing', function () {
			it('should always work', () => {
				const experiment = createExperiment('FOO-123/trivial')
					.withCohortPicker(() => { throw new Error('foo!') })

				return experiment.resolve()
					.then(assert_react_API_shape)
			})
		})
	})

	describe('resolveSync()', function () {

		context('on an unresolved experiment', function () {
			it('should throw', () => {
				const experiment = createExperiment('FOO-123/trivial')
					.withCohortPicker(() => Cohort['variation'])

				expect(experiment.resolveSync).to.throw('not resolved yet!')
			})
		})

		context('on a resolved experiment', function () {
			it('should work', () => {
				const experiment = createExperiment('FOO-123/trivial')
					.withCohortPicker(() => Cohort['variation'])

				return experiment.resolve()
					.then(() => {
						assert_react_API_shape(experiment.resolveSync())
					})
			})
		})
	})

	describe('trivial experiment', function () {

		it('should work', () => {
			const experiment = createExperiment('FOO-123/trivial')
				.withCohortPicker(() => Cohort['variation'])

			return experiment.resolve()
		})
	})
})
