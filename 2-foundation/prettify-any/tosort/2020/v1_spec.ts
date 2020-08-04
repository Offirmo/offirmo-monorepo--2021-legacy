import prettify_json from './v1'

describe('@offirmo-private/prettify-any', function() {

	describe('prettify_json()', function() {

		it('should work in default mode', () => {
			console.log(prettify_json({foo: 42}))
		})
	})
})
