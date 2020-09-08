/////////////////////

import deep_freeze from 'deep-freeze-strict'
import {TEST_TIMESTAMP_MS, get_human_readable_UTC_timestamp_minutes} from '@offirmo-private/timestamps'

/////////////////////

import * as Character from '@oh-my-rpg/state-character'
import * as Inventory from '@oh-my-rpg/state-inventory'
import * as Wallet from '@oh-my-rpg/state-wallet'
import * as PRNG from '@oh-my-rpg/state-prng'
import * as Energy from '@oh-my-rpg/state-energy'
import * as Engagement from '@oh-my-rpg/state-engagement'
import * as Codes from '@oh-my-rpg/state-codes'
import * as Progress from '@oh-my-rpg/state-progress'
import * as MetaState from '@oh-my-rpg/state-meta'

import { DEMO_WEAPON_1, Weapon } from '@oh-my-rpg/logic-weapons'
import { Armor } from '@oh-my-rpg/logic-armors'
import { DEMO_MONSTER_01 } from '@oh-my-rpg/logic-monsters'

/////////////////////

import { SCHEMA_VERSION } from './consts'
import { State, Adventure } from './types'
import { cleanup } from './migrations'
import { get_lib_SEC } from './services/sec'

/////////////////////

// needed to test migrations, both here and in composing parents

// a full featured, non-trivial demo state
// with dev gain
const DEMO_ADVENTURE_01: Readonly<Adventure> = deep_freeze<Adventure>({
	hid: 'fight_lost_any',
	uuid: 'uu1~example~adventure~01',
	good: true,
	encounter: DEMO_MONSTER_01,
	gains: {
		level: 0,
		health: 0,
		mana: 0,
		strength: 0,
		agility: 0,
		charisma: 0,
		wisdom: 0,
		luck: 1,
		coin: 0,
		token: 0,
		armor: null,
		weapon: null,
		improvementⵧarmor: false,
		improvementⵧweapon: false,
	},
})
// with coin gain
const DEMO_ADVENTURE_02: Readonly<Adventure> = deep_freeze<Adventure>({
	hid: 'dying_man',
	uuid: 'uu1~example~adventure~02',
	good: true,
	gains: {
		level: 0,
		health: 0,
		mana: 0,
		strength: 0,
		agility: 0,
		charisma: 0,
		wisdom: 0,
		luck: 0,
		coin: 1234,
		token: 0,
		weapon: null,
		armor: null,
		improvementⵧweapon: false,
		improvementⵧarmor: false,
	},
})
// with loot gain
const DEMO_ADVENTURE_03: Readonly<Adventure> = deep_freeze<Adventure>({
	hid: 'rare_goods_seller',
	uuid: 'uu1~example~adventure~03',
	good: true,
	gains: {
		level: 0,
		health: 0,
		mana: 0,
		strength: 0,
		agility: 0,
		charisma: 0,
		wisdom: 0,
		luck: 0,
		coin: 0,
		token: 0,
		weapon: DEMO_WEAPON_1,
		armor: null,
		improvementⵧweapon: false,
		improvementⵧarmor: false,
	},
})
// with weapon enhancement gain
const DEMO_ADVENTURE_04: Adventure = deep_freeze<Adventure>({
	hid: 'princess',
	uuid: 'uu1~example~adventure~04',
	good: true,
	gains: {
		level: 0,
		health: 0,
		mana: 0,
		strength: 0,
		agility: 0,
		charisma: 0,
		wisdom: 0,
		luck: 0,
		coin: 123,
		token: 0,
		weapon: null,
		armor: null,
		improvementⵧweapon: false,
		improvementⵧarmor: true,
	},
})

// can't build an example from disconnected sample states.
// taken from a real savegame:
const DEMO_STATE: Readonly<State> = deep_freeze<State>(cleanup(get_lib_SEC(), {
	'schema_version': 14,
	't_state': {
		'schema_version': 14,
		revision: 0,
		'timestamp_ms': 1598854700150,
		'energy': {
			'schema_version': 4, 'timestamp_ms': 1598854700150,
			revision: 0,
			'available_energy': {'d': 1, 'n': 7},
		},
	},
	'u_state': {
		'avatar': {
			'attributes': {
				'agility': 87,
				'charisma': 87,
				'health': 88,
				'level': 45,
				'luck': 91,
				'mana': 144,
				'strength': 95,
				'wisdom': 151,
			}, 'klass': 'knight', 'name': 'PerteProd', 'revision': 785, 'schema_version': 2,
		},
		'codes': {
			'redeemed_codes': {'ALPHATWINK': {'last_redeem_date_minutes': '20190423_08h09', 'redeem_count': 1}},
			'revision': 1,
			'schema_version': 1,
		},
		'creation_date': '20190423_08h08',
		'energy': {'max_energy': 7, 'revision': 0, 'schema_version': 4, 'total_energy_consumed_so_far': 1035},
		'engagement': {'queue': [], 'revision': 161, 'schema_version': 1},
		'inventory': {
			'revision': 281,
			'schema_version': 1,
			'slotted': {
				'armor': {
					'base_hid': 'boots',
					'base_strength': 52236,
					'element_type': 'item',
					'enhancement_level': 4,
					'qualifier1_hid': 'simple',
					'qualifier2_hid': 'twink',
					'quality': 'artifact',
					'slot': 'armor',
					'uuid': 'uu1dVeWKOZSUO6TwAutd0gDr',
				},
				'weapon': {
					'base_hid': 'scythe',
					'base_strength': 41892,
					'element_type': 'item',
					'enhancement_level': 1,
					'qualifier1_hid': 'strange',
					'qualifier2_hid': 'twink',
					'quality': 'artifact',
					'slot': 'weapon',
					'uuid': 'uu1IM5DRoi1a14hvaLCPPltm',
				},
			},
			'unslotted': [
				{
				'base_hid': 'spoon',
				'base_strength': 1,
				'element_type': 'item',
				'enhancement_level': 0,
				'qualifier1_hid': 'used',
				'qualifier2_hid': 'noob',
				'quality': 'common',
				'slot': 'weapon',
				'uuid': 'uu1SCAdaa62Dv-QHaaDQ7Nwf',
			} as Weapon, {
				'base_hid': 'shoes',
				'base_strength': 39841,
				'element_type': 'item',
				'enhancement_level': 0,
				'qualifier1_hid': 'emerald',
				'qualifier2_hid': 'mercenary',
				'quality': 'legendary',
				'slot': 'armor',
				'uuid': 'uu15ixnqBzBX_IMsvJ2WV-sS',
			} as Armor, {
				'base_hid': 'socks',
				'base_strength': 1,
				'element_type': 'item',
				'enhancement_level': 0,
				'qualifier1_hid': 'used',
				'qualifier2_hid': 'noob',
				'quality': 'common',
				'slot': 'armor',
				'uuid': 'uu1PJz7O5R5LLDmPYVUdGu77',
			} as Armor
			],
			'unslotted_capacity': 20,
		},
		'last_adventure': {
			'gains': {
				'agility': 1,
				'armor': null,
				'charisma': 0,
				'coin': 0,
				'health': 0,
				'improvementⵧarmor': false,
				'improvementⵧweapon': false,
				'level': 0,
				'luck': 0,
				'mana': 0,
				'strength': 0,
				'token': 0,
				'weapon': null,
				'wisdom': 0,
			}, 'good': true, 'hid': 'found_random_mushroom', 'uuid': 'uu1FXVTOup-drVDr9t-nXR3a',
		},
		'last_user_action_tms': 1598854698575,
		'meta': {
			'is_logged_in': true,
			'is_web_diversity_supporter': false,
			persistence_id: undefined,
			'revision': 1,
			'roles': ['admin', 'tbrpg:alpha'],
			'schema_version': 2,
		},
		'prng': {
			'recently_encountered_by_id': {
				'adventure_archetype--bad': ['bad_m4', 'bad_e1'],
				'adventure_archetype--good': ['magical_cooking_ragnaros', 'famous_stone_emerald', 'fight_lost_shortcoming', 'socketed_item', 'pet_squirrel', 'green_food', 'church_cellar_prisoner', 'fight_won_coins', 'rachel', 'fight_observe', 'found_silver_potion', 'unmatched_set', 'erika', 'always_keep_potions', 'found_fizzing_potion', 'side_quests', 'caravan_success', 'flying_rat', 'raining_dwarves', 'caravan_failure', 'bards', 'pet_black_cat', 'arrow_in_the_knee', 'sword_in_rock', 'refreshing_nap', 'chilies', 'vampire_castle', 'famous_stone_diamond', 'good_end', 'found_random_mushroom'],
			},
			'revision': 2607,
			'schema_version': 3,
			'seed': -1163955302,
			'use_count': 6504,
			'uuid': 'uu1IZxPCefT_N5wrZtkgVg3Q',
		},
		'progress': {
			'achievements': {
				'49 times… It was 49 times…': 'unlocked',
				'Absolute Explorer': 'unlocked',
				'Addicted': 'unlocked',
				'Alpha Of The Wilderness': 'revealed',
				'Alpha player': 'unlocked',
				'Aspiring Explorer': 'unlocked',
				'Awoken': 'unlocked',
				'Beta player': 'revealed',
				'Blessed': 'unlocked',
				'Born To Be Wild': 'unlocked',
				'Bright': 'unlocked',
				'Bring It On': 'unlocked',
				'Divinely Touched': 'unlocked',
				'Emperor-Looking Adventurer': 'revealed',
				'Epic Smile': 'unlocked',
				'Faithful': 'unlocked',
				'Famous Gems Collector': 'unlocked',
				'First Blood': 'unlocked',
				'Folk Hero': 'unlocked',
				'Formal Adventurer': 'unlocked',
				'Frog In A Well': 'unlocked',
				'Golden tongue': 'unlocked',
				'Graduated': 'unlocked',
				'Grandmaster Explorer': 'unlocked',
				'Grey Haired Adventurer': 'revealed',
				'Hacker': 'secret',
				'Hello darkness my old friend': 'revealed',
				'Hooked': 'unlocked',
				'I Am A Legend': 'unlocked',
				'I Am Back': 'unlocked',
				'I Can Handle It': 'unlocked',
				'I Like Swords!': 'revealed',
				'I Was Born Ready': 'unlocked',
				'I am bored': 'unlocked',
				'I am dead bored': 'unlocked',
				'I am very bored': 'unlocked',
				'Into The Wild': 'unlocked',
				'It’s good to be bad': 'unlocked',
				'I’ll Be Back': 'unlocked',
				'I’m not that innocent': 'unlocked',
				'Just plain lucky': 'unlocked',
				'King-looking Adventurer': 'unlocked',
				'Light Punishment': 'unlocked',
				'Local Strongperson': 'unlocked',
				'Long Lived Adventurer': 'hidden',
				'Looking Like something': 'unlocked',
				'Master Explorer': 'unlocked',
				'Mushrooms Gourmet': 'unlocked',
				'Mushrooms Lover': 'unlocked',
				'Newbie Adventurer': 'unlocked',
				'No-life except for boredom': 'revealed',
				'Oops!... I Did It Again': 'unlocked',
				'Potions Sommelier': 'unlocked',
				'Potions Taster': 'unlocked',
				'Rare Sight': 'unlocked',
				'Reasonable Adventurer': 'unlocked',
				'Reborn!': 'secret',
				'Registered adventurer': 'unlocked',
				'Regular': 'unlocked',
				'Rookie Explorer': 'unlocked',
				'Sage': 'unlocked',
				'Seasoned Adventurer': 'unlocked',
				'Senior Explorer': 'unlocked',
				'Sharp tongue': 'unlocked',
				'Silver tongue': 'unlocked',
				'Small One': 'unlocked',
				'Smart': 'unlocked',
				'Sorry my hand slipped': 'unlocked',
				'Spirit Of The Cat': 'revealed',
				'Spirit Of The Elephant': 'revealed',
				'Spirit Of The Gorilla': 'revealed',
				'Spirit Of The Human': 'unlocked',
				'Spirit Of The Monkey': 'revealed',
				'Spirit Of The Owl': 'unlocked',
				'Spirit Of The Rabbit': 'revealed',
				'Spirit Of The Tortoise': 'hidden',
				'Sprinkled': 'unlocked',
				'Summoned': 'unlocked',
				'Supporter of diversity': 'revealed',
				'Swift One': 'unlocked',
				'TEST': 'secret',
				'Teenage Adventurer': 'unlocked',
				'The Power Of The Mind': 'unlocked',
				'The Wild One': 'unlocked',
				'There Is No Spoon': 'unlocked',
				'They Weren’t Matched Anyway': 'unlocked',
				'Tiny Adventurer': 'unlocked',
				'Titan': 'unlocked',
				'Turn it up to eleven': 'unlocked',
				'Twinkle Twinkle Little Star': 'unlocked',
				'U Got The Look': 'unlocked',
				'Untouchable': 'unlocked',
				'Usurper': 'secret',
				'Vast Consciousness': 'unlocked',
				'Well Built': 'unlocked',
				'What’s in a name?': 'unlocked',
				'Wild Like The Wind': 'unlocked',
				'Young Explorer': 'unlocked',
				'did I mention I was bored?': 'unlocked',
				'king of boredom': 'unlocked',
			}, 'flags': null, 'revision': 1364, 'schema_version': 2, 'statistics': {
				'active_day_count': 915,
				'bad_play_count': 93,
				'bad_play_count_by_active_class': {'knight': 2, 'summoner': 91},
				'coins_gained': 458582,
				'encountered_adventures': {
					'DQ_good_slime': true,
					'always_keep_potions': true,
					'arrow_in_the_knee': true,
					'ate_bacon': true,
					'ate_zombie': true,
					'bad_1': true,
					'bad_2': true,
					'bad_3': true,
					'bad_4': true,
					'bad_5': true,
					'bad_6': true,
					'bad_e1': true,
					'bad_e2': true,
					'bad_m1': true,
					'bad_m3': true,
					'bad_m4': true,
					'bad_m5': true,
					'bad_m6': true,
					'bad_s1': true,
					'bad_s2': true,
					'bad_village': true,
					'balrog': true,
					'bandits_punishment': true,
					'bards': true,
					'best_meal': true,
					'bored_log': true,
					'busking': true,
					'capital_castle': true,
					'capital_royal_amusement_park': true,
					'capital_royal_road': true,
					'caravan_failure': true,
					'caravan_success': true,
					'castle_summon': true,
					'cat_out_tree': true,
					'chasm_leap': true,
					'chicken_slayer': true,
					'chilies': true,
					'church_book': true,
					'church_cellar_prisoner': true,
					'class_grimoire': true,
					'class_master_coolidge': true,
					'class_master_dark_holocron': true,
					'class_master_forbidden_knowledge': true,
					'class_master_half_battle': true,
					'class_master_primary_attr_1': true,
					'class_master_primary_attr_2': true,
					'class_master_second_attr': true,
					'class_master_sharpest_weapon': true,
					'clean_wizard_tower': true,
					'clover': true,
					'coffee': true,
					'colossal_cave': true,
					'colossal_cave_maze': true,
					'conscripted': true,
					'cookies_grandmas': true,
					'critters': true,
					'demon_king': true,
					'dragon_kebab': true,
					'drown_in_holy_water': true,
					'duke_rescue': true,
					'dying_man': true,
					'elementals': true,
					'elven_hydromel': true,
					'erika': true,
					'escort': true,
					'exile_GIFTS': true,
					'explore_catacombs': true,
					'explore_ruins': true,
					'fabric_of_reality': true,
					'false_lake': true,
					'famous_stone_diamond': true,
					'famous_stone_emerald': true,
					'famous_stone_ruby': true,
					'famous_stone_sapphire': true,
					'fate_sword': true,
					'fight_lost_any': true,
					'fight_lost_shortcoming': true,
					'fight_observe': true,
					'fight_won_any': true,
					'fight_won_coins': true,
					'fight_won_loot': true,
					'flying_rat': true,
					'foodie_friend': true,
					'foreign_language': true,
					'found_black_mushroom': true,
					'found_blue_mushroom': true,
					'found_bubbly_potion': true,
					'found_fizzing_potion': true,
					'found_green_mushroom': true,
					'found_journal': true,
					'found_orange_mushroom': true,
					'found_rainbow_mushroom': true,
					'found_random_mushroom': true,
					'found_red_mushroom': true,
					'found_silver_potion': true,
					'found_swirling_potion': true,
					'found_vermilion_potion': true,
					'found_white_mushroom': true,
					'found_worn_out_potion': true,
					'found_yellow_mushroom': true,
					'gehennom': true,
					'give_a_shield': true,
					'gold_nugget': true,
					'good_end': true,
					'good_necromancer': true,
					'green_food': true,
					'grinding': true,
					'guild_party_food': true,
					'high_level_zone_1': true,
					'high_level_zone_2': true,
					'horseshoe': true,
					'huge_tower': true,
					'idiot_bandits': true,
					'inspect_sewers': true,
					'jig': true,
					'keep_watch': true,
					'king_reward': true,
					'last_night': true,
					'last_quest': true,
					'lost': true,
					'lost_mine': true,
					'magic_lamp': true,
					'magical_cooking_ragnaros': true,
					'make_friends': true,
					'mana_mana': true,
					'meet_old_wizard': true,
					'meteor': true,
					'meteor_metal': true,
					'milk': true,
					'murderer': true,
					'need_for_speed': true,
					'nuclear_fusion_paper': true,
					'older': true,
					'pet_badger_mushrooms': true,
					'pet_black_cat': true,
					'pet_rainbow_lorikeet': true,
					'pet_red_eyed_unicorn': true,
					'pet_squirrel': true,
					'pileup': true,
					'princess': true,
					'princess_castle': true,
					'progress_loop': true,
					'rabbit_foot': true,
					'rabbit_hole': true,
					'rachel': true,
					'raining_dwarves': true,
					'raining_elves': true,
					'random_blessing': true,
					'rare_goods_seller': true,
					'refreshing_nap': true,
					'rematch': true,
					'ribert': true,
					'riddle_of_steel': true,
					'rings_of_power': true,
					'save_world_again': true,
					'sentients_killing': true,
					'side_quests': true,
					'so_many_potions': true,
					'socketed_item': true,
					'soul_weapon_pet_zombie': true,
					'square_eggs': true,
					'stare_cup': true,
					'sword_in_a_lake': true,
					'sword_in_rock': true,
					'talk_to_all_villagers': true,
					'treasure_in_pots': true,
					'unmatched_set': true,
					'useless': true,
					'vampire_castle': true,
					'village_farmwork': true,
					'village_gifts_blacksmith': true,
					'village_lost_father': true,
					'village_lost_kid': true,
					'village_nice_daughter': true,
					'village_strongman': true,
					'walk_in_mordor': true,
					'waterfall': true,
					'weird_duck': true,
					'wise_wisewood_tree': true,
					'witch_riddle': true,
				},
				'encountered_monsters': {
					'ant': true,
					'baby chick': true,
					'bat': true,
					'bear': true,
					'bee': true,
					'blowfish': true,
					'butterfly': true,
					'camel': true,
					'cat': true,
					'caterpillar': true,
					'chicken': true,
					'chipmunk': true,
					'crab': true,
					'dahu': true,
					'deer': true,
					'dolphin': true,
					'dove': true,
					'dragon': true,
					'dromedary': true,
					'drop bear': true,
					'eagle': true,
					'ewe': true,
					'fox': true,
					'frog': true,
					'fur-bearing truit': true,
					'ghost': true,
					'goat': true,
					'golem': true,
					'gorilla': true,
					'hamster': true,
					'hatching chick': true,
					'hoop snake': true,
					'horse': true,
					'joint snake': true,
					'koala': true,
					'lizard': true,
					'monkey': true,
					'octopus': true,
					'owl': true,
					'ox': true,
					'panda': true,
					'penguin': true,
					'pig': true,
					'pigeon': true,
					'poodle': true,
					'ram': true,
					'rat': true,
					'rhinoceros': true,
					'scorpion': true,
					'shark': true,
					'shrimp': true,
					'snail': true,
					'snake': true,
					'spider': true,
					'splintercat': true,
					'spreading adder': true,
					'squid': true,
					'tiger': true,
					'tropical fish': true,
					'turkey': true,
					'turtle': true,
					'unicorn': true,
					'water buffalo': true,
					'whale': true,
					'wolf': true,
				},
				'fight_lost_count': 49,
				'fight_won_count': 73,
				'good_play_count': 1028,
				'good_play_count_by_active_class': {'knight': 7, 'summoner': 1021},
				'has_account': false,
				'is_registered_alpha_player': false,
				'items_gained': 132,
				'last_visited_timestamp': '20200804',
				'tokens_gained': 44,
			}, 'wiki': null,
		},
		'revision': 1185,
		'schema_version': 14,
		'wallet': {'coin_count': 669470, 'revision': 336, 'schema_version': 1, 'token_count': 44},
	},
}, {}))

const FAKE_DEMO_STATE: Readonly<State> = deep_freeze<State>(cleanup(get_lib_SEC(), {
	schema_version: SCHEMA_VERSION,

	u_state: {
		schema_version: SCHEMA_VERSION,
		revision: 203,
		last_user_action_tms: TEST_TIMESTAMP_MS,

		creation_date: get_human_readable_UTC_timestamp_minutes(new Date(TEST_TIMESTAMP_MS)),

		avatar: Character.DEMO_STATE,
		inventory: Inventory.DEMO_STATE,
		wallet: Wallet.DEMO_STATE,
		prng: PRNG.DEMO_STATE,
		energy: Energy.DEMO_U_STATE,
		engagement: Engagement.acknowledge_all_seen(Engagement.DEMO_STATE),
		codes: Codes.DEMO_STATE,
		progress: Progress.DEMO_STATE,
		meta: MetaState.DEMO_STATE,
		last_adventure: DEMO_ADVENTURE_01,
	},

	t_state: {
		schema_version: SCHEMA_VERSION,
		revision: 1,
		timestamp_ms: TEST_TIMESTAMP_MS,

		energy: Energy.DEMO_T_STATE,
	},
}, {}))

/////////////////////

export {
	DEMO_ADVENTURE_01,
	DEMO_ADVENTURE_02,
	DEMO_ADVENTURE_03,
	DEMO_ADVENTURE_04,
	DEMO_STATE,
}

/////////////////////
