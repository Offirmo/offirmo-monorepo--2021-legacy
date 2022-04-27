import { expect } from 'chai'

import stable_stringify from '.'


describe('json-stable-stringify', function() {

	// test that we perform exactly as JSON.stringify for already sorted data
	describe('ALREADY SORTED situations', function () {

		function test_against_builtin(value: any): void {
			const resultⵧbuiltin = (() => {
				try {
					return JSON.stringify(value)
				}
				catch (err) {
					return `<exception! ${(err as any)?.message?.split('\n')?.[0]}>`
				}
			})()

			const resultⵧstable = (() => {
				try {
					return stable_stringify(value)
				}
				catch (err) {
					return `<exception! ${(err as any)?.message?.split('\n')?.[0]}>`
				}
			})()

			if (resultⵧbuiltin !== resultⵧstable) {
				console.log('≡')
				console.log('☑ JSON.stringify    :', resultⵧbuiltin)
				console.log('☐ stable-stringify  :', resultⵧstable)
			}
			expect(resultⵧstable).to.equal(resultⵧbuiltin)
		}

		describe('handling of primitive type/values', function() {
			// https://developer.mozilla.org/en-US/docs/Glossary/Primitive
			// string, number, bigint, boolean, undefined, and symbol

			it('should work with a single primitive -- string', () => {
				test_against_builtin('foo')
				test_against_builtin('42')
				test_against_builtin('')
			})

			it('should work with a single primitive -- number', () => {
				test_against_builtin(42)
				test_against_builtin(.05)
				test_against_builtin(0)
				test_against_builtin(-0)
				test_against_builtin(0.0)
				test_against_builtin(-1/3)
				test_against_builtin(NaN)
				test_against_builtin(+Infinity)
				test_against_builtin(-Infinity)
				test_against_builtin(Math.PI)
				test_against_builtin(Math.E)
				test_against_builtin(Number.EPSILON)
				test_against_builtin(Number.MAX_VALUE)
				test_against_builtin(Number.MIN_VALUE)
				test_against_builtin(Number.MAX_SAFE_INTEGER)
				test_against_builtin(Number.MIN_SAFE_INTEGER)
				test_against_builtin(0xDeadBeef)
				test_against_builtin(0b1001)
				test_against_builtin(.12e3)
			})

			it('should work with a single primitive -- bigint', () => {
				test_against_builtin(9007199254740991n)
				test_against_builtin(BigInt(Number.MAX_SAFE_INTEGER))
			})

			it('should work with a single primitive -- boolean', () => {
				test_against_builtin(true)
				test_against_builtin(false)
			})

			it('should work with a single primitive -- undefined', () => {
				test_against_builtin(undefined)
			})

			it('should work with a single primitive -- symbol', () => {
				let sym1 = Symbol()
				let sym2 = Symbol("key")
				let sym3 = Symbol("key")

				test_against_builtin(sym1)
				test_against_builtin(sym2)
				test_against_builtin(sym3)
			})
		})

		describe('handling of non-primitive type/values', function() {

			describe('null', function() {
				it('should work', () => {
					test_against_builtin(null)
				})
			})

			describe('arrays', function() {
				it('should work with elements being primitive types', () => {
					test_against_builtin([ 'foo', 'bar', 42, Symbol('key') ])
				})

				it('should work with elements being non-primitive types', () => {
					test_against_builtin([ () => {}, { foo: 'bar'} ])
				})

				it('should work with depth', () => {
					test_against_builtin([ [ 0 ], [ 1, 2 ] ])
				})

				it('should work with holes', () => {
					test_against_builtin(new Array(5))
					const a = new Array(5)
					a[3] = 3
					test_against_builtin(a)
				})

				it('should work with repeated references (NOT circular)', () => {
					const r: any = { foo: '42' }
					const a = [ r, r ]
					test_against_builtin(a)
				})

				it('should work with circular references', () => {
					const a: any[] = []
					a.push(a)
					test_against_builtin(a)
				})
			})

			describe('objects/hashes', function() {

				it('should work with attributes of primitive types  (key + value)', () => {
					test_against_builtin({
						k: undefined,
						23: null,
						[Symbol('key')]: 'bar',
						x: 42,
					})
				})

				it('should work with attributes of non-primitive types  (key + value)', () => {
					test_against_builtin({
						foo() {},
						.2e3: {
							n: 42
						}
					})
				})

				it('should work with attributes of pure JSON', () => {
					test_against_builtin({
						bar: 'baz',
						foo: 42,
						gloups: [ 'gnokman', -0 ],
						misc: {
							thanks: 'for the fish'
						}
					})
				})

				it('should work with attributes = repeated references (NOT circular)', () => {
					const r: any = { foo: '42' }
					const obj: any = { bar: r, baz: r }
					test_against_builtin(obj)
				})

				it('should work with attributes containing circular references', () => {
					const obj: any = { foo: '42' }
					obj.bar = obj
					test_against_builtin(obj)
				})
			})

			it('should work with complex circular references -- array + hashes', () => {
				const o: any = { circular: true }
				const a: any[] = [ 'circular' ]
				o.a = a
				a.push(o)

				test_against_builtin(o)
			})
			it('should work with complex circular references -- cross', () => {
				const o1: any = { id: 1 }
				const o2: any = { id: 2 }
				o1.ref = o2
				o2.ref = o1

				test_against_builtin({ o1, o2 })
			})

			describe('other object', function() {

				it('should work with objects -- base', () => {
					test_against_builtin({})
					test_against_builtin(new Object())
				})

				it('should work with objects -- no proto', () => {
					test_against_builtin(Object.create(null))
				})

				it('should work with objects -- this', () => {
					test_against_builtin(this)
				})

				it('should work with objects -- known global', () => {
					test_against_builtin(globalThis)
				})

				it('should work with common object types: function', () => {
					test_against_builtin((a: number) => {})
					test_against_builtin(function foo(a: number) {})
					test_against_builtin(Number)

					test_against_builtin({ foo(a: number) {} }) // directly in an object
					test_against_builtin({ bar: function foo(a: number) {} }) // indirectly in an object
					test_against_builtin({ bar: (a: number) => {} }) // unnamed in an object
				})

				it('should work with common object types: Error', () => {
					test_against_builtin(new Error('foo!'))
					test_against_builtin(new TypeError('foo!'))
				})

				it('should work with common object types: Set', () => {
					const s0 = new Set()
					test_against_builtin(s0)

					const s1 = new Set('foo')
					test_against_builtin(s1)

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
					test_against_builtin(s2)

					const ws1 = new WeakSet([s0, s1])
					test_against_builtin(ws1)
				})

				it('should work with common object types: Map', () => {
					test_against_builtin(new Map())
				})

				it('should work with common object types: primitive types in their object form', () => {
					test_against_builtin(new String('string'))
					test_against_builtin(new Number(42))
					test_against_builtin(new Boolean(true))
				})

				it('should work with common object types: Date', () => {
					const d1 = new Date()
					test_against_builtin(d1)
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

					test_against_builtin(Greeter)
					test_against_builtin(greeter)
					function Foo() {}
					test_against_builtin(Foo)
				})
			})
		})

		describe('special cases', function() {

			it('should be able to handle deep objects', () => {
				const deep_obj: any = {
					depth: 0,
				}
				const deep_arr: any = [0]
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

					deep_arr_deepest.push([i])
					deep_arr_deepest = deep_arr_deepest[1]
					deep_mixed_deepest = deep_mixed_deepest[0].sub = [{
						depth: i * 2,
					}]
				}

				test_against_builtin(deep_obj)
				test_against_builtin(deep_arr)
				test_against_builtin(deep_mixed)
			})
		})
	})
})
