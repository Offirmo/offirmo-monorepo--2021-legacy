import { expect } from 'chai'
import { Enum } from 'typescript-string-enums'

import { Random, Engine } from '@offirmo/random'

import { CoinsGain } from '../types'
import {
	RawAdventureArchetypeEntry,
	i18n_messages,
	ENTRIES,
} from '.'
import { OFFIRMO_BLAND_REPARTITION_ADJUSTMENT } from './i18n_en'

const DISTRIB_ADJUSTMENT_ENTRIES_HIDS: string[] = [
	...Object.keys(OFFIRMO_BLAND_REPARTITION_ADJUSTMENT),
	'cookies_grandmas',
]

describe('@oh-my-rpg/logic-adventures - data:', function () {
	const _: any = i18n_messages.en
	const ARCHETYPES: { [key: string]: RawAdventureArchetypeEntry } = {}
	ENTRIES.forEach(entry => ARCHETYPES[entry.hid] = entry)

	Object.keys(_.adventures).forEach(function(key: string) {

		describe(`i18n key "${key}"`, function() {

			it('should have the correct format', () => {
				expect(_.adventures[key]).to.be.a('string')
			})

			it('should have a corresponding descriptor', () => {
				expect(ARCHETYPES).to.have.property(key)
			})
		})
	})

	Object.keys(ARCHETYPES).forEach(function(hid: string) {

		describe(`hid "${hid}"`, function() {

			it('should have the correct format', () => {
				expect(ARCHETYPES[hid]).to.have.property('good')
				expect(ARCHETYPES[hid]).to.have.property('outcome')
				if (ARCHETYPES[hid].good)
					expect(Object.keys(ARCHETYPES[hid].outcome).length, 'outcome length').to.be.above(0)
			})

			it('should have an en i18n message', () => {
				expect(_).to.have.nested.property(`adventures.${hid}`)
			})
		})
	})

	describe('stats', function() {
		const ENTRIES_GOOD = ENTRIES.filter(entry => entry.good)
		const SORTED_EXPECTED_OUTCOMES = [
			'level',
			'health',
			'mana',
			'agility',
			'charisma',
			'luck',
			'strength',
			'wisdom',

			'random_attribute',
			'lowest_attribute',
			'class_primary_attribute',
			'class_secondary_attribute',

			'armor',
			'weapon',
			'armor_or_weapon',
			'improvementⵧweapon',
			'improvementⵧarmor',
			'improvementⵧarmor_or_weapon',

			'token',
			...Enum.values(CoinsGain).filter(v => v!= 'none').map(v => 'coin:' + v),
		]



		it('brags about the number of stories', () => {
			console.log('Good entries: # ' + ENTRIES_GOOD.length)
		})

		it('has an outcome of each type with a correct distribution', () => {
			const stats_normal: any = {}
			const stats_adjustments: any = {}

			ENTRIES_GOOD.forEach(entry => {
				const stats = DISTRIB_ADJUSTMENT_ENTRIES_HIDS.includes(entry.hid)
					? stats_adjustments
					: stats_normal

				const outcome: any = entry.outcome
				Object.keys(outcome).forEach(gain_key => {
					if (typeof outcome[gain_key] !== 'boolean' && gain_key !== 'token') {
						gain_key = gain_key + ':' + outcome[gain_key]
						stats[gain_key] = stats[gain_key]
							? stats[gain_key] + 1
							: 1
					}
					else {
						stats[gain_key] = stats[gain_key]
							? stats[gain_key] + 1
							: 1
					}
				})
			})

			expect(Object.keys(stats_normal).sort(), 'all seen outcome types').to.deep.equal([...SORTED_EXPECTED_OUTCOMES].sort())

			SORTED_EXPECTED_OUTCOMES.forEach(gain_key => {
				let count = stats_normal[gain_key]
				if (stats_adjustments[gain_key])
					count += stats_adjustments[gain_key]

				let text = `${gain_key}                `.slice(0, 20) + ' = ' + count

				if (stats_adjustments[gain_key])
					text += ` (${stats_normal[gain_key]} + ${stats_adjustments[gain_key]})`

				console.log(text)
				if (gain_key === 'level' || gain_key === 'wisdom' || gain_key === 'token')
					console.log('-------')
			})
		})

		it('auto helps to fix the errors', () => {
			const missing_descriptors: string[] = []

			Object.keys(_.adventures).forEach(function(key: string) {
				if (!ARCHETYPES[key]) {
					missing_descriptors.push(key)
				}
			})

			if (missing_descriptors.length) {
				missing_descriptors.forEach(key => {
					const outcome: any = {}
					const text = _.adventures[key]

					if (text.includes('level')) outcome.level = true
					if (text.includes('{{health}}')) outcome.health = true
					if (text.includes('{{mana}}')) outcome.mana = true
					if (text.includes('{{strength}}')) outcome.strength = true
					if (text.includes('{{agility}}')) outcome.agility = true
					if (text.includes('{{charisma}}')) outcome.charisma = true
					if (text.includes('{{wisdom}}')) outcome.wisdom = true
					if (text.includes('{{luck}}')) outcome.luck = true
					if (text.includes('{{attr_name}}')) outcome.XXX_attribute = true

					if (text.includes('{{coin}}')) outcome.coin = 'XXX'
					if (text.includes('{{token}}')) outcome.token = 1

					if (text.includes('{{item}}')) outcome.XXX_armor_or_weapon = true

					if(Object.keys(outcome).length === 0) outcome.improvementⵧarmor_or_weapon = true

					const hid_part = `hid: '${key}',                                         `
					console.log(`	{ good: true, type: story, ${hid_part.slice(0, 36)} outcome: ${JSON.stringify(outcome)}},`)
				})
			}
		})
	})
})
