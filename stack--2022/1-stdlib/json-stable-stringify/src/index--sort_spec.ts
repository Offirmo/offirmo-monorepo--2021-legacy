import { expect } from 'chai'
import * as fetch_ponyfill from 'fetch-ponyfill'

import stable_stringify from '.'

const { fetch } = fetch_ponyfill()


describe('json-stable-stringify', function() {

	// test that we perform exactly as JSON.stringify for already sorted data
	describe.only('SORTABLE situations', function () {

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

			if (resultⵧbuiltin === resultⵧstable) {
				console.log('☑ JSON.stringify    :', resultⵧbuiltin)
				throw new Error('Unexpected equality. Is it a sortable situation?')
			}
			else {
				if (resultⵧbuiltin.length !== resultⵧstable?.length) {
					console.log('≡')
					console.log('☑ JSON.stringify    :', resultⵧbuiltin)
					console.log('☐ stable-stringify  :', resultⵧstable)
				}
			}
			expect(resultⵧstable).not.to.equal(resultⵧbuiltin)
			expect(resultⵧstable?.length).to.equal(resultⵧbuiltin.length)
		}

		describe('handling of sortable nodes', function() {

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
						foo: 42,
						bar: 'baz',
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
		})

		describe('special cases', function() {

			it('should be able to handle deep objects - fetch', () => {
				const ↆf = fetch('https://www.google.com')

				return ↆf.then(
					(fetch_raw_result: any) => {
						test_against_builtin(fetch_raw_result)
					}
				)
			})

			it('should be able to handle huge blobs', () => {
				test_against_builtin(process.env)
			})
		})
	})
})
