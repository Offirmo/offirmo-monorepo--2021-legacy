import {
	prettify_js,
} from './v2'

describe.only('@offirmo-private/prettify-js', function() {

	describe('prettify_js()', function() {

		describe('handling of primitive type/values', function() {
			// https://developer.mozilla.org/en-US/docs/Glossary/Primitive
			// string, number, bigint, boolean, undefined, and symbol

			it('should work with a single primitive -- string', () => {
				console.log(prettify_js('foo'))
				console.log(prettify_js('42'))
			})

			it('should work with a single primitive -- number', () => {
				console.log(prettify_js(42))
				console.log(prettify_js(.05))
				console.log(prettify_js(0))
				console.log(prettify_js(-0))
				console.log(prettify_js(0.0))
				console.log(prettify_js(-1/3))
			})

			it('should work with a single primitive -- bigint', () => {
				console.log(prettify_js('TODO'))
			})

			it('should work with a single primitive -- boolean', () => {
				console.log(prettify_js(true))
				console.log(prettify_js(false))
			})

			it('should work with a single primitive -- undefined', () => {
				console.log(prettify_js(undefined))
			})

			it('should work with a single primitive -- symbol', () => {
				console.log(prettify_js('foo'))
				console.log(prettify_js('42'))
			})
		})


		it('should work in default mode', () => {
			console.log(prettify_js({foo: 42}))
		})
	})
})
