import chalk from 'chalk'
import { render as prettify_json } from 'prettyjson'
import fetch_ponyfill from 'fetch-ponyfill'

import { inject_lib__chalk } from './injectable-lib--chalk'
inject_lib__chalk(chalk)

import {
	prettify_any as _prettify_any,
} from './v2'

const { fetch } = fetch_ponyfill()


describe('@offirmo-private/prettify-any', function() {
	const should_test_verbose = false

	describe('prettify_any()', function() {
		function prettify_any(...args: Parameters<typeof _prettify_any>) {
			const prettified = _prettify_any(...args)
			if (prettified.startsWith('[error prettifying:'))
				throw new Error(prettified)
			return prettified
		}
		function test_to_console(value: any): void {
			console.log('≡')
			console.log('☑ default console:', value)
			console.log('☐ prettyjson     :', (() => {
				try {
					return prettify_json(value)
				}
				catch (err) {
					return '<prettyjson error!>'
				}

			})())
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

			describe('null', function() {
				it('should work', () => {
					test_to_console(null)
				})
			})

			describe('arrays', function() {
				it('should work with elements being primitive types', () => {
					test_to_console([ 'foo', 'bar', 42, Symbol('key') ])
				})

				it('should work with elements being non-primitive types', () => {
					test_to_console([ () => {}, { foo: 'bar'} ])
				})

				it('should work with depth', () => {
					test_to_console([ [ 0 ], [ 1, 2 ] ])
				})

				it('should work with holes', () => {
					test_to_console(new Array(5))
					const a = new Array(5)
					a[3] = 3
					test_to_console(a)
				})

				it('should work repeated references (not circular)', () => {
					const r: any = { foo: '42' }
					const a = [ r, r ]
					test_to_console(a)
				})

				it('should work with circular references', () => {
					const a: any[] = []
					a.push(a)
					test_to_console(a)
				})
			})

			describe('objects/hashes', function() {
				it('should work with attributes of primitive types  (key + value)', () => {
					test_to_console({
						k: undefined,
						23: null,
						[Symbol('key')]: 'bar',
						x: 42,
					})
				})

				it('should work with attributes of non-primitive types  (key + value)', () => {
					test_to_console({
						foo() {},
						.2e3: {
							n: 42
						}
					})
				})

				it('should work with attributes of pure JSON', () => {
					test_to_console({
						foo: 42,
						bar: 'baz',
						gloups: [ 'gnokman', -0 ],
						misc: {
							thanks: 'for the fish'
						}
					})
				})

				it('should work with attributes = repeated references', () => {
					const r: any = { foo: '42' }
					const obj: any = { bar: r, baz: r }
					test_to_console(obj)
				})

				it('should work with attributes containing circular references', () => {
					const obj: any = { foo: '42' }
					obj.bar = obj
					test_to_console(obj)
				})
			})

			it('should work with complex circular references -- array + hashes', () => {
				const o: any = { circular: true }
				const a: any[] = [ 'circular' ]
				o.a = a
				a.push(o)

				test_to_console(o)
			})
			it('should work with complex circular references -- cross', () => {
				const o1: any = { id: 1 }
				const o2: any = { id: 2 }
				o1.ref = o2
				o2.ref = o1

				test_to_console({ o1, o2 })
			})

			describe('other object', function() {

				it('should work with objects -- base', () => {
					test_to_console({})
					test_to_console(new Object())
				})

				it('should work with objects -- no proto', () => {
					test_to_console(Object.create(null))
				})

				it('should work with objects -- this', () => {
					if (should_test_verbose) test_to_console(this)
				})

				it('should work with objects -- known global', () => {
					if (should_test_verbose) test_to_console(globalThis)
				})

				it('should work with common object types: function', () => {
					test_to_console((a: number) => {})
					test_to_console(function foo(a: number) {})
					test_to_console(Number)

					test_to_console({ foo(a: number) {} }) // directly in an object
					test_to_console({ bar: function foo(a: number) {} }) // indirectly in an object
					test_to_console({ bar: (a: number) => {} }) // unnamed in an object
				})

				it('should work with common object types: Error', () => {
					test_to_console(new Error('foo!'))
					test_to_console(new TypeError('foo!'))
				})

				it('should work with common object types: Set', () => {
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

				it('should work with common object types: Map', () => {
					test_to_console(new Map())
				})

				it('should work with common object types: primitive types in their object form', () => {
					test_to_console(new String('string'))
					test_to_console(new Number(42))
					test_to_console(new Boolean(true))
				})

				it('should work with common object types: Date', () => {
					const d1 = new Date()
					test_to_console(d1)
				})

				it('should work with common object types: classes', () => {
					class Greeter {
						greeting: string

						constructor(message: string) {
							this.greeting = message
						}

						greet() {
							return "Hello, " + this.greeting
						}
					}

					let greeter = new Greeter("world")

					test_to_console(Greeter)
					test_to_console(greeter)
					function Foo() {}
					test_to_console(Foo)
				})
			})

		})

		describe('special cases', function() {

			it('should be able to handle deep objects', () => {
				const deep_obj: any = {
					depth: 0,
				}
				const deep_arr: any = [ 0 ]
				const deep_mixed: any = [{
					depth: 0,
				}]

				let deep_obj_deepest: any = deep_obj
				let deep_arr_deepest: any = deep_arr
				let deep_mixed_deepest: any = deep_mixed

				for (let i = 1; i < 100; ++i) {
					deep_obj_deepest = deep_obj_deepest.sub = {
						depth: i,
					}

					deep_arr_deepest.push([ i ])
					deep_arr_deepest = deep_arr_deepest[1]
					deep_mixed_deepest = deep_mixed_deepest[0].sub = [{
						depth: i*2,
					}]


				}
				console.log('☐ prettify_any(…):', prettify_any(deep_obj))
				console.log('☐ prettify_any(…):', prettify_any(deep_arr))
				console.log('☐ prettify_any(…):', prettify_any(deep_mixed))
			})

			it('should be able to handle deep objects - fetch', () => {
				const ↆf = fetch('https://www.google.com')

				return ↆf.then(
					(fetch_raw_result: any) => {
						test_to_console(fetch_raw_result)
					}
				)
			})

			it('should be able to handle huge blobs', () => {
				console.log('☐ prettify_any(…):', prettify_any(process.env))
			})
		})
	})
})
