import prettify_json from '.'

describe('@offirmo-private/prettify-json', function() {

	describe('prettify_json()', function() {

		it('should work in default mode', () => {
			console.log(prettify_json({foo: 42}))
		})
	})
})
