import { expect } from 'chai'
import sinon from 'sinon'
import { Enum } from 'typescript-string-enums'

import { LIB } from '../consts'

import { createExperiment } from '.'
import {Cohort, Requirement, ResolvedExperiment} from "../types";


// tslint:disable-next-line: variable-name
const ParamType = Enum(
	'kill_switch',
	'cohort_picker',
	'requirement',
)
type ParamType = Enum<typeof ParamType> // eslint-disable-line no-redeclare


// tslint:disable-next-line: variable-name
const TestParamBehavior = Enum(
	'good_returns_synchronously',
	'good_returns_asynchronously_immediate',
	'good_returns_asynchronously_just_in_time',

	'bad_returns_illegal_synchronously',
	'bad_returns_illegal_asynchronously',
	'bad_throws_synchronously',
	'bad_throws_asynchronously',
	'bad_returns_asynchronously_too_late',
)
type TestParamBehavior = Enum<typeof TestParamBehavior> // eslint-disable-line no-redeclare

const RESOLUTION_TIMEOUT_MS = 5_000
const TEST_DELAY_MS = 4_500


function get_good_non_default_return_value(type: ParamType): any {
	switch(type) {
		case ParamType.kill_switch:
			return true
		case ParamType.cohort_picker:
			return 'variation-3'
		case ParamType.requirement:
			return true
		default:
			throw new Error('TODO!')
	}
}

function get_implementation(type: ParamType, behavior: TestParamBehavior): any {
	const good_non_default_return_value = get_good_non_default_return_value(type)

	switch(behavior) {
		case TestParamBehavior.good_returns_synchronously:
			return () => good_non_default_return_value
		case TestParamBehavior.good_returns_asynchronously_immediate:
			return () => new Promise((resolve) => {
				resolve(good_non_default_return_value)
			})
		case TestParamBehavior.good_returns_asynchronously_just_in_time:
			return () => new Promise((resolve) => {
				setTimeout(() => resolve(good_non_default_return_value), TEST_DELAY_MS)
			})


		case TestParamBehavior.bad_returns_asynchronously_too_late:
			return () => new Promise((resolve) => {
				setTimeout(() => resolve(good_non_default_return_value), RESOLUTION_TIMEOUT_MS + 1)
			})
		case TestParamBehavior.bad_returns_illegal_synchronously:
			return () => 'foo'
		case TestParamBehavior.bad_returns_illegal_asynchronously:
			return () => new Promise((resolve) => {
				resolve('foo')
			})
		case TestParamBehavior.bad_throws_synchronously:
			return () => { throw new Error(`${type} sync error!`) }
		case TestParamBehavior.bad_throws_asynchronously:
			return () => new Promise((resolve, reject) => {
				reject(new Error(`${type} async error!`))
			})

		default:
			throw new Error('TODO!')
	}
}

function assert_react_API_shape(result: Readonly<any>) {
	expect(result.cohort).to.be.a('string')
	expect(Enum.isType(Cohort, result.cohort)).to.be.true

	expect(result.isEligible).to.be.a('boolean')

	expect(result.ineligibilityReasons).to.be.an('array')
	result.ineligibilityReasons.forEach((reason: string, index: number) => {
		expect(reason, `reason#${index}`).to.be.a('string')
	})
}

function assert_not_enrolled_shape(result: Readonly<any>) {
	expect(result.cohort).to.equal('not-enrolled')
	expect(result.isEligible).to.equal(false)
	expect(result.ineligibilityReasons).to.have.lengthOf(1)

	expect(result.shouldRun).to.equal(false)
	expect(result.feedback).to.have.lengthOf(1)

	// TODO more tests
}

function assert_enrolled_shape(result: Readonly<any>) {
	expect(result.cohort).to.equal(get_good_non_default_return_value(ParamType.cohort_picker))
	expect(result.isEligible).to.equal(true)
	expect(result.ineligibilityReasons).to.have.lengthOf(0)

	expect(result.shouldRun).to.equal(true)
	expect(result.feedback).to.have.lengthOf(0)
}

describe(`${LIB} - sugar API`, function() {
	let clock: any
	beforeEach(function (){
		clock = sinon.useFakeTimers(0)
	})
	afterEach(function (){
		clock.restore()
	})

	function currentEventLoopEnd() {
		return new Promise(resolve => {
			setImmediate(resolve)
			clock.tick(0)
		})
	}

	Enum.keys(ParamType).forEach(type => {
		context(`when all params are trivials and ${type} is……`, function () {

			Enum.keys(TestParamBehavior).forEach(behavior => {
				context(`…${type} behaving as: ${behavior}`, function () {

					it(`should ${behavior.startsWith('good_') ? 'work': 'default to not-enrolled'}`, async function () {
						const experiment = createExperiment(`go/${type}/${behavior}`)
							.withKillSwitch(
								get_implementation(
									ParamType.kill_switch,
									type === ParamType.kill_switch
										? behavior
										: TestParamBehavior.good_returns_synchronously
								)
							)
							.withCohortPicker(
								get_implementation(
									ParamType.cohort_picker,
									type === ParamType.cohort_picker
										? behavior
										: TestParamBehavior.good_returns_synchronously
								)
							)
							.withRequirement({
								key: 'test',
								resolver: get_implementation(
									ParamType.requirement,
									type === ParamType.requirement
										? behavior
										: TestParamBehavior.good_returns_synchronously
								)
							})
							.build()

						const p = experiment.resolve()
							.then(result => {
								const resolved_at = +Date.now()

								assert_react_API_shape(result)

								// TODO test resolution date

								if (behavior.startsWith('good_')) {
									assert_enrolled_shape(result)
									console.log({ resolved_at, result })
									//console.log(result.feedback)
								}
								else {
									assert_not_enrolled_shape(result)
									console.log({ resolved_at, result })
									console.log(result.feedback)
								}
							})

						await currentEventLoopEnd()
						clock.tick(1) // T = 1
						await currentEventLoopEnd()
						clock.tick(TEST_DELAY_MS - 2) // T = TEST_DELAY_MS - 1
						await currentEventLoopEnd()
						clock.tick(1) // T = TEST_DELAY_MS

						await currentEventLoopEnd()
						clock.tick(RESOLUTION_TIMEOUT_MS - TEST_DELAY_MS - 1) // T = RESOLUTION_TIMEOUT_MS - 1
						await currentEventLoopEnd()
						clock.tick(1) // T = RESOLUTION_TIMEOUT_MS

						await currentEventLoopEnd()
						clock.tick(1) // T = RESOLUTION_TIMEOUT_MS + 1
						await currentEventLoopEnd()

						return p
						// catch should never happen and will be caught by mocha
					})
				})
			})
		})
	})

	describe('basic cases', function() {

		describe('resolve()', function () {

			context('on a trivial experiment', function () {
				it('should always work', () => {
					const experiment = createExperiment('go/test')
						.withCohortPicker(() => Cohort['variation'])
						.build()

					return experiment.resolve()
						.then(assert_react_API_shape)
				})
			})

			context('on an incorrect experiment - cohort picker throwing', function () {
				it('should always work', () => {
					const experiment = createExperiment('go/test')
						.withCohortPicker(() => { throw new Error('foo!') })
						.build()

					return experiment.resolve()
						.then(assert_react_API_shape)
				})
			})
		})

		describe('resolveSync()', function () {

			context('on an unresolved experiment', function () {
				it('should throw', () => {
					const experiment = createExperiment('go/test')
						.withCohortPicker(() => Cohort['variation'])
						.build()

					expect(experiment.resolveSync).to.throw('not resolved yet!')
				})
			})

			context('on a resolved experiment', function () {
				it('should work', () => {
					const experiment = createExperiment('go/test')
						.withCohortPicker(() => Cohort['variation'])
						.build()

					return experiment.resolve()
						.then(() => {
							assert_react_API_shape(experiment.resolveSync())
						})
				})
			})
		})

		describe('trivial experiment', function () {

			it('should work', () => {
				const experiment = createExperiment('go/test')
					.withCohortPicker(() => Cohort['variation'])
					.build()

				return experiment.resolve()
			})
		})
	})
})
