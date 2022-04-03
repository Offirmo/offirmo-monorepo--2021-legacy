import { expect } from 'chai'

import { Enum } from 'typescript-string-enums'
import { ItemQuality, InventorySlot } from '@tbrpg/definitions'
import { Random, Engine } from '@offirmo/random'

import { LIB } from './consts'
import {
	OVERALL_STRENGTH_INTERVAL_BY_QUALITY,
	BASE_STRENGTH_INTERVAL_BY_QUALITY,
	MAX_ENHANCEMENT_LEVEL,
	Weapon,
	create,
	get_damage_interval,
	get_medium_damage,
	get_ultimate_medium_damage,
	matches,
} from '.'


describe(`${LIB} - selectors`, function() {
	let rng: Engine = Random.engines.mt19937().seed(789)
	let TEST_ITEM: Weapon = create(rng)
	beforeEach(() => {
		rng = Random.engines.mt19937().seed(789)
		TEST_ITEM = create(rng, {
			base_hid: 'luth',
			qualifier1_hid: 'simple',
			qualifier2_hid: 'mercenary',
			quality: 'legendary',
			base_strength: 45_000,
			enhancement_level: 3,
		})
	})

	describe('internals', function() {

		describe('BASE_STRENGTH_INTERVAL_BY_QUALITY', function() {
			it('should be as expected', () => {
				//console.log(BASE_STRENGTH_INTERVAL_BY_QUALITY)

				if (Object.keys(BASE_STRENGTH_INTERVAL_BY_QUALITY).length !== Enum.keys(ItemQuality).length)
					throw new Error(`${LIB} base - outdated code!`)
			})
		})
	})

	describe('damage', function() {

		describe('get_damage_interval()', function() {

			it('should work', () => {
				const [min, max] = get_damage_interval(TEST_ITEM)
				expect(min).to.be.a('number')
				expect(max).to.be.a('number')
				expect(max).to.be.above(min)

				expect(min, 'overall min').to.be.above(OVERALL_STRENGTH_INTERVAL_BY_QUALITY[ItemQuality.legendary][0]) // min for legend+3
				expect(max, 'base max').to.be.above(BASE_STRENGTH_INTERVAL_BY_QUALITY[ItemQuality.legendary][1]) // max for legend+3
				expect(max, 'overall max').to.be.below(OVERALL_STRENGTH_INTERVAL_BY_QUALITY[ItemQuality.legendary][1]) // max for legend+3

				expect(min).to.equal(55575)
				expect(max).to.equal(61425)
			})
		})

		describe('get_medium_damage()', function() {

			it('should work', () => {
				const med = get_medium_damage(TEST_ITEM)
				expect(med).to.be.a('number')

				expect(med, 'overall min').to.be.above(OVERALL_STRENGTH_INTERVAL_BY_QUALITY[ItemQuality.legendary][0])
				expect(med, 'base min').to.be.above(BASE_STRENGTH_INTERVAL_BY_QUALITY[ItemQuality.legendary][0])
				expect(med, 'overall max').to.be.below(OVERALL_STRENGTH_INTERVAL_BY_QUALITY[ItemQuality.legendary][1])

				expect(med).to.equal(Math.round((55575 + 61425) / 2))
			})
		})
	})

	describe('get_ultimate_medium_damage()', function() {

		it('should work', () => {
			const umed = get_ultimate_medium_damage(TEST_ITEM)
			expect(umed).to.be.a('number')

			expect(umed, 'overall min').to.be.above(OVERALL_STRENGTH_INTERVAL_BY_QUALITY[ItemQuality.legendary][0])
			expect(umed, 'base min').to.be.above(BASE_STRENGTH_INTERVAL_BY_QUALITY[ItemQuality.legendary][0])
			expect(umed, 'current med').to.be.above(get_medium_damage(TEST_ITEM))
			expect(umed, 'formula').to.equal(get_medium_damage({
				...TEST_ITEM,
				enhancement_level: MAX_ENHANCEMENT_LEVEL,
			}))
			expect(umed, 'overall max').to.be.below(OVERALL_STRENGTH_INTERVAL_BY_QUALITY[ItemQuality.legendary][1])

			expect(umed).to.equal(81000)
		})
	})

	describe('matches()', function() {
		const REF: Readonly<Weapon> = create(rng, {
			quality: ItemQuality.rare,
			base_hid: 'socks',
			qualifier1_hid: 'onyx',
			qualifier2_hid: 'tormentor',
			base_strength: 4000,
		})

		it('should correctly match when appropriate', function() {
			expect(matches(REF, {}), '0').to.be.true
			expect(matches(REF, {
				quality: ItemQuality.rare,
			}), '1a').to.be.true
			expect(matches(REF, {
				qualifier1_hid: 'onyx',
			}), '1b').to.be.true
			expect(matches(REF, {
				quality: ItemQuality.rare,
				base_hid: 'socks',
			}), '2a').to.be.true
			expect(matches(REF, {
				quality: ItemQuality.rare,
				base_hid: 'socks',
				qualifier1_hid: 'onyx',
				qualifier2_hid: 'tormentor',
				base_strength: 4000,
			}), '5').to.be.true
		})

		it('should correctly NOT match when appropriate', function() {
			expect(matches(REF, {
				quality: ItemQuality.common,
			}), '1a').to.be.false
			expect(matches(REF, {
				qualifier1_hid: 'dwarven',
			}), '1b').to.be.false
			expect(matches(REF, {
				quality: ItemQuality.rare,
				base_hid: 'mantle',
			}), '2a').to.be.false
			expect(matches(REF, {
				quality: ItemQuality.legendary,
				base_hid: 'socks',
			}), '2b').to.be.false
			expect(matches(REF, {
				quality: ItemQuality.rare,
				base_hid: 'socks',
				qualifier1_hid: 'onyx',
				qualifier2_hid: 'tormentor',
				base_strength: 20,
			}), '5').to.be.false
		})

		it('should correctly throw when appropriate', function() {
			expect(() => {
				matches(REF, {
					slot: InventorySlot.armor,
				} as any)
			}, 'slot').to.throw('non-weapon slot')

			expect(() => {
				matches(REF, {
					foo: 42,
				} as any)
			}, 'foreign').to.throw('non-weapon key')
		})
	})
})
