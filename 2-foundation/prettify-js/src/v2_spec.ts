import {
	prettify_any,
} from './v2'

describe('@offirmo-private/prettify-js', function() {
	const should_test_verbose = false

	describe('prettify_any()', function() {
		function test_to_console(value: any): void {
			console.log('≡')
			console.log('☑ default console:', value)
			console.log('☐ prettify_any(…):', prettify_any(value))
		}

		describe('handling of primitive type/values', function() {
			// https://developer.mozilla.org/en-US/docs/Glossary/Primitive
			// string, number, bigint, boolean, undefined, and symbol

			it('should work with a single primitive -- string', () => {
				test_to_console('foo')
				test_to_console('42')
				test_to_console('')
			})

			it('should work with a single primitive -- number', () => {
				test_to_console(42)
				test_to_console(.05)
				test_to_console(0)
				test_to_console(-0)
				test_to_console(0.0)
				test_to_console(-1/3)
				test_to_console(NaN)
				test_to_console(+Infinity)
				test_to_console(-Infinity)
				test_to_console(Math.PI)
				test_to_console(Math.E)
				test_to_console(Number.EPSILON)
				test_to_console(Number.MAX_VALUE)
				test_to_console(Number.MIN_VALUE)
				test_to_console(Number.MAX_SAFE_INTEGER)
				test_to_console(Number.MIN_SAFE_INTEGER)
				test_to_console(0xDeadBeef)
				test_to_console(0b1001)
				test_to_console(.12e3)
			})

			// TODO uncomment when switching to ES2020
			it('should work with a single primitive -- bigint') /*, () => {
				test_to_console(9007199254740991n)
				test_to_console(BigInt(Number.MAX_SAFE_INTEGER))
			})*/

			it('should work with a single primitive -- boolean', () => {
				test_to_console(true)
				test_to_console(false)
			})

			it('should work with a single primitive -- undefined', () => {
				test_to_console(undefined)
			})

			it('should work with a single primitive -- symbol', () => {
				let sym1 = Symbol()
				let sym2 = Symbol("key")
				let sym3 = Symbol("key")

				test_to_console(sym1)
				test_to_console(sym2)
				test_to_console(sym3)
			})
		})

		describe('handling of non-primitive type/values', function() {

			it('should work with primitive types in their object form', () => {
				test_to_console(new String('string'))
				test_to_console(new Number(42))
				test_to_console(new Boolean(true))
			})

			it('should work with arrays of primitive types', () => {
				test_to_console([ 'foo', 'bar', 42, Symbol('key') ])
			})
			it('should work with arrays of non-primitive types', () => {
				test_to_console([ () => {}, { foo: 'bar'} ])
			})

			it('should work with objects -- base', () => {
				test_to_console({})
				test_to_console(null)
				test_to_console(Object.create(null))
				test_to_console(new Boolean(true))
				if (should_test_verbose) test_to_console(globalThis)
				if (should_test_verbose) test_to_console(this)
			})
			it('should work with objects of primitive types  (key + value)', () => {
				test_to_console({
					k: undefined,
					23: null,
					[Symbol('key')]: 'bar',
					x: 42,
				})
			})
			it('should work with objects of non-primitive types  (key + value)', () => {
				test_to_console({
					foo() {},
					.2e3: {
						n: 42
					}
				})
			})
			it('should work with objects of pure JSON', () => {
				test_to_console({
					foo: 42,
					bar: 'baz',
					gloups: [ 'gnokman', -0 ],
					misc: {
						thanks: 'for the fish'
					}
				})
			})
			it.skip('should work with circular objects', () => {
				const obj: any = { foo: '42' }
				obj.bar = obj
				test_to_console(obj)
			})

			it('should work with functions', () => {
				test_to_console((a: number) => {})
				test_to_console(function foo(a: number) {})
				test_to_console(Number)

				test_to_console({ foo(a: number) {} }) // directly in an object
				test_to_console({ bar: function foo(a: number) {} }) // indirectly in an object
				test_to_console({ bar: (a: number) => {} }) // unnamed in an object
			})

			it('should work with errors', () => {
				test_to_console(new Error('foo!'))
				test_to_console(new TypeError('foo!'))
			})

			it('should work with sets', () => {
				const s0 = new Set()
				test_to_console(s0)

				const s1 = new Set('foo')
				test_to_console(s1)

				const s2 = new Set([
					'foo',
					42,
					//42n,
					true,
					undefined,
					Symbol('foo'),
					null,
					{ X: 33},
				])
				test_to_console(s2)

				const ws1 = new WeakSet([s0, s1])
				test_to_console(ws1)
			})

			it('should work with maps', () => {
				test_to_console(new Map())
			})

			it('should work with classes', () => {
				test_to_console({foo: 42})
			})

		})



	})
})
