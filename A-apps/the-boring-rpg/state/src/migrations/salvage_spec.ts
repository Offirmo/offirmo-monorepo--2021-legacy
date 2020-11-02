import {expect} from 'chai'

import { xxx_internal_reset_prng_cache } from '@oh-my-rpg/state-prng'
import { enforce_immutability } from '@offirmo-private/state-utils'

import { LIB } from '../consts'

import { reset_and_salvage } from './salvage'
import { DEMO_STATE } from '../examples'



describe(`${LIB} - salvaging of an outdated savegame`, function() {
	beforeEach(() => xxx_internal_reset_prng_cache())

	it('should be able to salvage a v4+ savegame', () => {
		const NAME = 'Perte'
		const CLASS = 'paladin'
		const GOOD_PLAY_COUNT = 86
		const BAD_PLAY_COUNT = 0

		const PSEUDO_V4 = enforce_immutability({
			'schema_version': 4,
			'revision': 203,
			'avatar': {
				'schema_version': 2,
				'revision': 42,
				'name': NAME,
				'klass': CLASS,
			},
			'prng': {
				'seed': 1234,
			},
			'click_count': GOOD_PLAY_COUNT + BAD_PLAY_COUNT,
			'good_click_count': GOOD_PLAY_COUNT,
		})

		const salvaged_state = reset_and_salvage(PSEUDO_V4)

		expect(salvaged_state.u_state.avatar.name).to.equal(NAME)
		expect(salvaged_state.u_state.avatar.klass).to.equal(CLASS)
		expect(salvaged_state.u_state.progress.statistics.good_play_count, 'good').to.equal(GOOD_PLAY_COUNT)
		expect(salvaged_state.u_state.progress.statistics.bad_play_count, 'bad').to.equal(BAD_PLAY_COUNT)
	})

	it('should be able to salvage a v6+ savegame', () => {
		const NAME = 'LiddiLidd'
		const CLASS = 'warrior'
		const GOOD_PLAY_COUNT = 429
		const BAD_PLAY_COUNT = 433 - 429

		const PSEUDO_V4 = enforce_immutability({
			'schema_version': 6,
			'revision': 485,
			'uuid': 'uu1EO9VgTjPlR1YPj0yfdWjG',
			'creation_date': '20180813_00h33',
			'avatar': {
				'schema_version': 2,
				'revision': 326,
				'name': NAME,
				'klass': CLASS,
				'attributes': {
					'level': 19,
					'health': 51,
					'mana': 41,
					'strength': 83,
					'agility': 30,
					'charisma': 30,
					'wisdom': 46,
					'luck': 31,
				},
			},
			'prng': {
				'schema_version': 2,
				'revision': 452,
				'seed': 1425674993,
				'use_count': 2867,
			},
			'click_count': GOOD_PLAY_COUNT + BAD_PLAY_COUNT,
			'good_click_count': GOOD_PLAY_COUNT,
			'meaningful_interaction_count': GOOD_PLAY_COUNT + BAD_PLAY_COUNT,
		})

		const salvaged_state = reset_and_salvage(PSEUDO_V4)

		expect(salvaged_state.u_state.avatar.name).to.equal(NAME)
		expect(salvaged_state.u_state.avatar.klass).to.equal(CLASS)
		expect(salvaged_state.u_state.progress.statistics.good_play_count).to.equal(GOOD_PLAY_COUNT)
		expect(salvaged_state.u_state.progress.statistics.bad_play_count).to.equal(BAD_PLAY_COUNT)
	})

	it('should be able to salvage a v7+ savegame', () => {
		const NAME = 'LiddiLidd'
		const CLASS = 'warrior'
		const GOOD_PLAY_COUNT = 429
		const BAD_PLAY_COUNT = 433 - 429

		const PSEUDO_V7 = enforce_immutability({
			'schema_version': 6,
			'revision': 485,
			'uuid': 'uu1EO9VgTjPlR1YPj0yfdWjG',
			'creation_date': '20180813_00h33',
			'avatar': {
				'schema_version': 2,
				'revision': 326,
				'name': NAME,
				'klass': CLASS,
				'attributes': {
					'level': 19,
					'health': 51,
					'mana': 41,
					'strength': 83,
					'agility': 30,
					'charisma': 30,
					'wisdom': 46,
					'luck': 31,
				},
			},
			'prng': {
				'schema_version': 2,
				'revision': 452,
				'seed': 1425674993,
				'use_count': 2867,
			},
			'progress': {
				'statistics': {
					'last_visited_timestamp': '20180813',
					'active_day_count': 12,
					'good_play_count': GOOD_PLAY_COUNT,
					'bad_play_count': BAD_PLAY_COUNT,
				},
			},
		})

		const salvaged_state = reset_and_salvage(PSEUDO_V7 as any)

		expect(salvaged_state.u_state.avatar.name).to.equal(NAME)
		expect(salvaged_state.u_state.avatar.klass).to.equal(CLASS)
		expect(salvaged_state.u_state.progress.statistics.good_play_count).to.equal(GOOD_PLAY_COUNT)
		expect(salvaged_state.u_state.progress.statistics.bad_play_count).to.equal(BAD_PLAY_COUNT)
	})

	it('should be able to salvage a v.LATEST savegame', () => {
		const salvaged_state = reset_and_salvage(DEMO_STATE as any)

		expect(salvaged_state.u_state.avatar.name).to.equal('PerteProd')
		expect(salvaged_state.u_state.avatar.klass).to.equal('knight')
		expect(salvaged_state.u_state.progress.statistics.good_play_count).to.equal(1028)
		expect(salvaged_state.u_state.progress.statistics.bad_play_count).to.equal(93)
	})

	it('should be able to salvage total crap', () => {
		const salvaged_state = reset_and_salvage({foo: 42})

		expect(salvaged_state.u_state.avatar.name.startsWith('A')).to.be.true
		expect(salvaged_state.u_state.avatar.klass).not.to.equal('novice')
		expect(salvaged_state.u_state.progress.statistics.good_play_count, 'good').to.equal(0)
		expect(salvaged_state.u_state.progress.statistics.bad_play_count, 'bad').to.equal(0)
	})

	it('should be able to salvage a specifically buggy savegame', () => {
			const BUGGY: any = {
				'uuid': 'uu1EO9VgTjPlR1YPj0yfdWjG',
				'creation_date': '20180813_00h33',
				'schema_version': 7,
				'revision': 218,
				'avatar': {
					'schema_version': 2,
					'revision': 42,
					'name': 'Perte',
					'klass': 'paladin',
					'attributes': {
						'level': 13,
						'health': 12,
						'mana': 23,
						'strength': 4,
						'agility': 5,
						'charisma': 6,
						'wisdom': 7,
						'luck': 8,
					},
				},
				'inventory': {
					'schema_version': 1,
					'revision': 42,
					'unslotted_capacity': 20,
					'slotted': {
						'armor': {
							'uuid': 'uu1~test~demo~armor~0002',
							'element_type': 'item',
							'slot': 'armor',
							'base_hid': 'belt',
							'qualifier1_hid': 'brass',
							'qualifier2_hid': 'apprentice',
							'quality': 'legendary',
							'base_strength': 19,
							'enhancement_level': 8,
						},
						'weapon': {
							'uuid': 'uu1~test~demo~weapon~001',
							'element_type': 'item',
							'slot': 'weapon',
							'base_hid': 'axe',
							'qualifier1_hid': 'admirable',
							'qualifier2_hid': 'adjudicator',
							'quality': 'uncommon',
							'base_strength': 2,
							'enhancement_level': 0,
						},
					},
					'unslotted': [
						{
							'uuid': 'uu1~test~demo~weapon~002',
							'element_type': 'item',
							'slot': 'weapon',
							'base_hid': 'bow',
							'qualifier1_hid': 'arcanic',
							'qualifier2_hid': 'ambassador',
							'quality': 'legendary',
							'base_strength': 19,
							'enhancement_level': 8,
						},
						{
							'uuid': 'uu1~test~demo~armor~0001',
							'element_type': 'item',
							'slot': 'armor',
							'base_hid': 'armguards',
							'qualifier1_hid': 'bone',
							'qualifier2_hid': 'ancients',
							'quality': 'uncommon',
							'base_strength': 2,
							'enhancement_level': 0,
						},
					],
				},
				'wallet': {
					'schema_version': 1,
					'revision': 43,
					'coin_count': 23606,
					'token_count': 89,
				},
				'prng': {
					'schema_version': 2,
					'revision': 111,
					'seed': 1234,
					'use_count': 117,
					'recently_encountered_by_id': {
						'item': [
							'axe',
							'sword',
						],
						'adventures': [
							'dragon',
							'king',
						],
						'mistery': [],
						'adventure_archetype--good': [
							'fight_won_coins',
						],
					},
				},
				'energy': {
					'schema_version': 1,
					'revision': 451,
					'max_energy': 7,
					'base_energy_refilling_rate_per_day': 7,
					'last_date': 'ts1_20181205_22h06:26.784',
					'last_available_energy_float': 6,
				},
				'engagement': {
					'schema_version': 1,
					'revision': 70,
					'queue': [],
				},
				'codes': {
					'schema_version': 1,
					'revision': 3,
					'redeemed_codes': {
						'BORED': {
							'redeem_count': 1,
							'last_redeem_date_minutes': '20181030_21h23',
						},
					},
				},
				'progress': {
					'schema_version': 2,
					'revision': 102,
					'wiki': null,
					'flags': null,
					'achievements': {
						'TEST': 'unlocked',
						'Summoned': 'unlocked',
						'Alpha player': 'unlocked',
						'Beta player': 'revealed',
						'I am bored': 'unlocked',
						'Turn it up to eleven': 'unlocked',
						'I am dead bored': 'revealed',
						'did I mention I was bored?': 'hidden',
						'king of boredom': 'hidden',
						'No-life except for boredom': 'hidden',
						'Hello darkness my old friend': 'hidden',
						'What’s in a name?': 'unlocked',
						'Graduated': 'unlocked',
						'I am very bored': 'unlocked',
						'Sorry my hand slipped': 'unlocked',
						'Oops!... I Did It Again': 'unlocked',
						'I’m not that innocent': 'revealed',
						'It’s good to be bad': 'hidden',
						'I’ll be back': 'unlocked',
						'Regular': 'unlocked',
						'Faithful': 'revealed',
						'Hooked': 'hidden',
						'Addicted': 'hidden',
						'There Is No Spoon': 'unlocked',
						'They Weren’t Matched Anyway': 'unlocked',
						'I Was Born Ready': 'unlocked',
						'U Got The Look': 'unlocked',
						'Rare Sight': 'revealed',
						'Epic Smile': 'hidden',
						'I Am A Legend': 'hidden',
						'Twinkle Twinkle Little Star': 'hidden',
						'Frog In A Well ⚔ 🛡 ': 'unlocked',
						'Looking Like something': 'unlocked',
						'Formal Adventurer': 'unlocked',
						'King-looking Adventurer': 'revealed',
						'Emperor-Looking Adventurer': 'hidden',
						'As Tall As 3 Apples': 'unlocked',
						'Able To Reason': 'unlocked',
						'Teenage Adventurer': 'unlocked',
						'Newbie Adventurer': 'revealed',
						'Seasoned Adventurer': 'hidden',
						'Grey Haired Adventurer': 'hidden',
						'Spirit Of The Tortoise': 'hidden',
						'Long Lived Adventurer': 'hidden',
						'Light Punishment': 'unlocked',
						'Bring It On': 'revealed',
						'I Can Handle It': 'hidden',
						'Spirit Of The Elephant': 'hidden',
						'Awoken': 'unlocked',
						'The Power Of The Mind': 'revealed',
						'Vast Consciousness': 'hidden',
						'Spirit Of The Human': 'hidden',
						'Well Built': 'revealed',
						'Local Strongperson': 'hidden',
						'Titan': 'hidden',
						'Spirit Of The Gorilla': 'hidden',
						'Small One': 'revealed',
						'Swift One': 'hidden',
						'Untouchable': 'hidden',
						'Spirit Of The Monkey': 'hidden',
						'Sharp tongue': 'revealed',
						'Silver tongue': 'hidden',
						'Golden tongue': 'hidden',
						'Spirit Of The Cat': 'hidden',
						'Bright': 'revealed',
						'Smart': 'hidden',
						'Sage': 'hidden',
						'Spirit Of The Owl': 'hidden',
						'Sprinkled': 'revealed',
						'Blessed': 'hidden',
						'Divinely Touched': 'hidden',
						'Spirit Of The Rabbit': 'hidden',
						'I Like Swords!': 'revealed',
						'Usurper': 'secret',
						'Just plain lucky': 'secret',
						'Cheater': 'secret',
						'Reborn!': 'secret',
					},
					'statistics': {
						'last_visited_timestamp': '20181205',
						'active_day_count': 13,
						'good_play_count': 13,
						'bad_play_count': 3,
						'encountered_adventures': {
							'caravan_success': true,
							'dying_man': true,
							'ate_bacon': true,
							'ate_zombie': true,
							'refreshing_nap': true,
							'older': true,
							'fight_won_coins': true,
						},
						'encountered_monsters': {
							'wolf': true,
							'spreading adder': true,
							'fur-bearing truit': true,
							'ram': true,
						},
						'good_play_count_by_active_class': {
							'paladin': 1,
							'novice': 7,
							'warrior': 5,
						},
						'bad_play_count_by_active_class': {
							'novice': 2,
							'warrior': 1,
						},
						'has_account': true,
						'is_registered_alpha_player': false,
						'coins_gained': null,
						'tokens_gained': null,
						'items_gained': null,
					},
				},
				'last_adventure': {
					'uuid': 'uu1jOtiUU1SFGECwshKp6I07',
					'hid': 'fight_won_coins',
					'good': true,
					'encounter': {
						'name': 'ram',
						'level': 14,
						'rank': 'boss',
						'possible_emoji': '🐏',
					},
					'gains': {
						'level': 0,
						'health': 0,
						'mana': 0,
						'strength': 0,
						'agility': 0,
						'charisma': 0,
						'wisdom': 0,
						'luck': 0,
						'coin': 150,
						'token': 0,
						'armor': null,
						'weapon': null,
						'armor_improvement': false,
						'weapon_improvement': false,
					},
				},
			}

			const salvaged_state = reset_and_salvage(BUGGY)

			expect(salvaged_state.u_state.avatar.name).to.equal('Perte')
			expect(salvaged_state.u_state.avatar.klass).to.equal('paladin')
			expect(salvaged_state.u_state.progress.statistics.good_play_count).to.equal(13)
			expect(salvaged_state.u_state.progress.statistics.bad_play_count).to.equal(3)
		})
})
