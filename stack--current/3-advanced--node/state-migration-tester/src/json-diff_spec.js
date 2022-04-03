const { expect } = require('chai')

const { generate_uuid, xxx_test_unrandomize_element } = require('@offirmo-private/uuid')


const {
	get_raw_diff,
	get_advanced_diff
} = require('./json-diff')
const { LIB } = require('./consts')


describe(`${LIB} - json diff`, function() {

	describe('get_advanced_diff()', function() {

		context('when no difference - by value', function () {
			it('should work', () => {
				expect(get_advanced_diff(
					{ foo: 33},
					{ foo: 33},
				)).to.be.undefined

				expect(get_advanced_diff(
					[{ foo: 33}],
					[{ foo: 33}],
				)).to.be.undefined
			})
		})

		context('when actual difference', function () {
			it('should work', () => {
				const diff = get_advanced_diff(
					{ foo: 33},
					{ foo: 42},
				)
				expect(diff).to.have.deep.property('foo', [33, 42])
			})
		})

		context('when non-semantic difference: @offirmo-private/state-migration-tester', function () {

			it('should work', () => {
				const test_obj_a = { uuid: generate_uuid() }
				const test_obj_b = { uuid: generate_uuid() }

				expect(get_advanced_diff( test_obj_a, test_obj_b )).to.be.undefined

				// but the raw diff would have
				expect(get_raw_diff( test_obj_a, test_obj_b )).to.have.deep.property('uuid')
			})
		})
	})
})
