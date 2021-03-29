import { I18nMessages } from '@offirmo-private/ts-types'

import { messages as en } from './i18n_en'

// TODO type better? (coins)
import { CoinsGain, OutcomeArchetype, AdventureType } from '../types'

interface RawAdventureArchetypeEntry {
	good: boolean
	hid: string
	type: AdventureType
	outcome: Partial<OutcomeArchetype>
	isBeta?: boolean // TODO
}

const story = AdventureType.story
const fight = AdventureType.fight

const ENTRIES: Readonly<RawAdventureArchetypeEntry>[] = [
	{ good: false, type: story, hid: 'bad_s1', outcome: {}},
	{ good: false, type: story, hid: 'bad_s2', outcome: {}},
	{ good: false, type: story, hid: 'bad_m1', outcome: {}},
	{ good: false, type: story, hid: 'bad_m2', outcome: {}},
	{ good: false, type: story, hid: 'bad_m3', outcome: {}},
	{ good: false, type: story, hid: 'bad_m4', outcome: {}},
	{ good: false, type: story, hid: 'bad_m5', outcome: {}},
	{ good: false, type: story, hid: 'bad_m6', outcome: {}},
	{ good: false, type: story, hid: 'bad_e1', outcome: {}},
	{ good: false, type: story, hid: 'bad_e2', outcome: {}},

	{ good: true, type: fight, hid: 'fight_won_coins',        outcome: { coin:'gainꘌsmall' }},
	{ good: true, type: fight, hid: 'fight_won_loot',         outcome: { armor_or_weapon:true }},
	{ good: true, type: fight, hid: 'fight_won_any',          outcome: { random_attribute:true }},
	{ good: true, type: fight, hid: 'fight_observe',          outcome: { class_secondary_attribute:true }},
	{ good: true, type: fight, hid: 'fight_lost_any',         outcome: { random_attribute:true }},
	{ good: true, type: fight, hid: 'fight_lost_shortcoming', outcome: { lowest_attribute:true }},

	{ good: true, type: story, hid: 'bored_log',              outcome: { strength:true }},
	{ good: true, type: story, hid: 'caravan_success',        outcome: { coin:'gainꘌsmall' }},
	{ good: true, type: story, hid: 'dying_man',              outcome: { coin:'gainꘌmedium' }},
	{ good: true, type: story, hid: 'ate_bacon',              outcome: { level:true }},
	{ good: true, type: story, hid: 'ate_zombie',             outcome: { mana:true }},
	{ good: true, type: story, hid: 'refreshing_nap',         outcome: { health:true }},
	{ good: true, type: story, hid: 'older',                  outcome: { level:true }},
	{ good: true, type: story, hid: 'stare_cup',              outcome: { mana:true }},
	{ good: true, type: story, hid: 'nuclear_fusion_paper',   outcome: { wisdom:true }},
	{ good: true, type: story, hid: 'found_green_mushroom',   outcome: { level:true }},

	{ good: true, type: story, hid: 'eaten_by_a_grue',            outcome: { coin:'lossꘌsmall'}},
	{ good: true, type: story, hid: 'walk_in_mordor',             outcome: { agility:true }},
	{ good: true, type: story, hid: 'jig',                        outcome: { agility:true }},
	{ good: true, type: story, hid: 'good_end',                   outcome: { wisdom:true }},
	{ good: true, type: story, hid: 'waterfall',                  outcome: { health:true }},
	{ good: true, type: story, hid: 'meteor',                     outcome: { luck:true }},
	{ good: true, type: story, hid: 'weird_duck',                 outcome: { coin:'gainꘌhuge'}},
	{ good: true, type: story, hid: 'last_quest',                 outcome: { level:true }},
	{ good: true, type: story, hid: 'busking',                    outcome: { token: 1}},
	{ good: true, type: story, hid: 'best_meal',                  outcome: { health:true }},
	{ good: true, type: story, hid: 'witch_riddle',               outcome: { wisdom:true }},
	{ good: true, type: story, hid: 'princess_castle',            outcome: { luck:true }},
	{ good: true, type: story, hid: 'problem',                    outcome: { coin:'lossꘌsmall'}},
	{ good: true, type: story, hid: 'foreign_language',           outcome: { charisma:true }},
	{ good: true, type: story, hid: 'last_night',                 outcome: { luck:true }},
	{ good: true, type: story, hid: 'chasm_leap',                 outcome: { agility:true }},
	{ good: true, type: story, hid: 'luxurious_meal',             outcome: { coin:'lossꘌsmall'}},
	{ good: true, type: story, hid: 'donate',                     outcome: { coin:'lossꘌsmall', token: 1}},
	{ good: true, type: story, hid: 'coffee',                     outcome: { wisdom:true }},
	{ good: true, type: story, hid: 'socks',                      outcome: { coin:'lossꘌsmall'}},
	{ good: true, type: story, hid: 'gold_nugget',                outcome: { coin:'gainꘌmedium'}},
	{ good: true, type: story, hid: 'pileup',                     outcome: { coin:'lossꘌsmall'}},
	{ good: true, type: story, hid: 'tavern',                     outcome: { coin:'lossꘌsmall'}},
	{ good: true, type: story, hid: 'magic_lamp',                 outcome: { luck:true }},
	{ good: true, type: story, hid: 'rabbit_hole',                outcome: { wisdom:true }},
	{ good: true, type: story, hid: 'cat_out_tree',               outcome: { agility:true }},
	{ good: true, type: story, hid: 'green_food',                 outcome: { health:true }},
	{ good: true, type: story, hid: 'wishing_well',               outcome: { coin:'lossꘌone'}},
	{ good: true, type: story, hid: 'conscripted',                outcome: { coin:'gainꘌsmall'}},
	{ good: true, type: story, hid: 'brigands',                   outcome: { coin:'lossꘌsmall'}},
	{ good: true, type: story, hid: 'duke_rescue',                outcome: { coin:'gainꘌmedium'}},
	{ good: true, type: story, hid: 'bribe',                      outcome: { coin:'lossꘌsmall'}},
	{ good: true, type: story, hid: 'doctor',                     outcome: { coin:'lossꘌsmall'}},
	{ good: true, type: story, hid: 'gazebo',                     outcome: { coin:'lossꘌsmall'}},
	{ good: true, type: story, hid: 'sock_drawer',                outcome: { coin:'lossꘌsmall'}},
	{ good: true, type: story, hid: 'flying_rat',                 outcome: { coin:'lossꘌsmall'}},

	{ good: true, type: story, hid: 'found_red_mushroom',     outcome: { health:true }},
	{ good: true, type: story, hid: 'found_blue_mushroom',    outcome: { mana:true }},
	{ good: true, type: story, hid: 'found_white_mushroom',   outcome: { strength:true }},
	{ good: true, type: story, hid: 'found_yellow_mushroom',  outcome: { agility:true }},
	{ good: true, type: story, hid: 'found_orange_mushroom',  outcome: { charisma:true }},
	{ good: true, type: story, hid: 'found_black_mushroom',   outcome: { wisdom:true }},
	{ good: true, type: story, hid: 'found_rainbow_mushroom', outcome: { luck:true }},

	{ good: true, type: story, hid: 'demon_king',                   outcome: { weapon:true }},
	{ good: true, type: story, hid: 'false_lake',                   outcome: { coin:'gainꘌmedium', armor_or_weapon:true }},
	{ good: true, type: story, hid: 'soul_weapon_pet_zombie',       outcome: { health:true }},
	{ good: true, type: story, hid: 'class_master_sharpest_weapon', outcome: { class_primary_attribute:true }},
	{ good: true, type: story, hid: 'good_necromancer',             outcome: { agility:true }},
	{ good: true, type: story, hid: 'talk_to_all_villagers',        outcome: { charisma:true }},
	{ good: true, type: story, hid: 'fate_sword',                   outcome: { coin:'gainꘌsmall' }},
	{ good: true, type: story, hid: 'rematch',                      outcome: { level:true }},
	{ good: true, type: story, hid: 'useless',                      outcome: { wisdom:true }},
	{ good: true, type: story, hid: 'escort',                       outcome: { health:true }},
	{ good: true, type: story, hid: 'rare_goods_seller',            outcome: { armor_or_weapon: true, coin:'lossꘌsmall' }},
	{ good: true, type: story, hid: 'progress_loop',                outcome: { armor_or_weapon:true }},
	{ good: true, type: story, hid: 'idiot_bandits',                outcome: { coin:'gainꘌmedium' }},
	{ good: true, type: story, hid: 'princess',                     outcome: { coin:'gainꘌmedium', improvementⵧarmor_or_weapon:true }},
	{ good: true, type: story, hid: 'bad_village',                  outcome: { mana:true }},
	{ good: true, type: story, hid: 'so_many_potions',              outcome: { strength:true }},
	{ good: true, type: story, hid: 'high_level_zone_1',            outcome: { class_primary_attribute:true }},
	{ good: true, type: story, hid: 'high_level_zone_2',            outcome: { class_secondary_attribute:true }},
	{ good: true, type: story, hid: 'side_quests',                  outcome: { coin:'gainꘌmedium'}},
	{ good: true, type: story, hid: 'balrog',                       outcome: { level:true }},
	{ good: true, type: story, hid: 'castle_summon',                outcome: { weapon:true }},
	{ good: true, type: story, hid: 'unmatched_set',                outcome: { coin:'gainꘌbig'}},

	{ good: true, type: story, hid: 'bards',                        outcome: { charisma:true }},
	{ good: true, type: story, hid: 'elementals',                   outcome: { class_secondary_attribute:true }},
	{ good: true, type: story, hid: 'fabric_of_reality',            outcome: { mana:true }},
	{ good: true, type: story, hid: 'save_world_again',             outcome: { charisma: true,'coin':'gainꘌbig','armor_or_weapon':true }},
	{ good: true, type: story, hid: 'clean_wizard_tower',           outcome: { mana:true }},
	{ good: true, type: story, hid: 'explore_ruins',                outcome: { coin:'gainꘌmedium', armor_or_weapon :true }},
	{ good: true, type: story, hid: 'inspect_sewers',               outcome: { class_secondary_attribute: true, coin:'gainꘌmedium'}},
	{ good: true, type: story, hid: 'explore_catacombs',            outcome: { coin:'gainꘌmedium', armor_or_weapon:true }},
	{ good: true, type: story, hid: 'bandits_punishment',           outcome: { coin:'gainꘌmedium'}},

	{ good: true, type: story, hid: 'evil_laugh',                   outcome: { charisma: true}},
	{ good: true, type: story, hid: 'hero_smile',                   outcome: { charisma: true}},
	{ good: true, type: story, hid: 'bg_music',                     outcome: { class_primary_attribute:true }},
	{ good: true, type: story, hid: 'owlbear',                      outcome: { charisma: true}},
	{ good: true, type: story, hid: 'book_hobbit_riddles',          outcome: { wisdom: true}},
	{ good: true, type: story, hid: 'book_excuses_dragon',          outcome: { charisma: true}},

	{ good: true, type: story, hid: 'magical_cooking_ragnaros',     outcome: { strength:true }},
	{ good: true, type: story, hid: 'wise_wisewood_tree',           outcome: { wisdom:true }},
	{ good: true, type: story, hid: 'murderer',                     outcome: { luck:true }},

	{ good: true, type: story, hid: 'visual_effect',                outcome: { improvementⵧarmor_or_weapon:true }},
	{ good: true, type: story, hid: 'weapon_damage_type',           outcome: { improvementⵧweapon:true }},
	{ good: true, type: story, hid: 'give_a_shield',                outcome: { armor:true }},
	{ good: true, type: story, hid: 'treasure_in_pots',             outcome: { coin:'gainꘌsmall' }},
	{ good: true, type: story, hid: 'chicken_slayer',               outcome: { strength:true }},
	{ good: true, type: story, hid: 'arrow_in_the_knee',            outcome: { wisdom:true }},
	{ good: true, type: story, hid: 'sentients_killing',            outcome: { coin:'gainꘌsmall', class_primary_attribute:true }},
	{ good: true, type: story, hid: 'colossal_cave',                outcome: { armor_or_weapon: true, class_primary_attribute:true }},
	{ good: true, type: story, hid: 'colossal_cave_maze',           outcome: { armor_or_weapon:true }},
	{ good: true, type: story, hid: 'gehennom',                     outcome: { coin:'gainꘌmedium', armor_or_weapon:true }},
	{ good: true, type: story, hid: 'exile_GIFTS',                  outcome: { improvementⵧweapon:true }},
	{ good: true, type: story, hid: 'DQ_good_slime',                outcome: { class_primary_attribute:true }},
	{ good: true, type: story, hid: 'socketed_item',                outcome: { improvementⵧarmor_or_weapon:true }},

	{ good: true, type: story, hid: 'guild_rank',                   outcome: { level:true }},
	{ good: true, type: story, hid: 'runes',                        outcome: { improvementⵧarmor_or_weapon:true }},

	{ good: true, type: story, hid: 'drown_in_holy_water',          outcome: { mana:true }},
	{ good: true, type: story, hid: 'rings_of_power',               outcome: { charisma:true }},
	{ good: true, type: story, hid: 'raining_elves',                outcome: { mana:true }},
	{ good: true, type: story, hid: 'raining_dwarves',              outcome: { strength:true }},
	{ good: true, type: story, hid: 'need_for_speed',               outcome: { agility:true }},
	{ good: true, type: story, hid: 'riddle_of_steel',              outcome: { improvementⵧarmor_or_weapon:true }},
	{ good: true, type: story, hid: 'sword_in_rock',                outcome: { weapon:true }},
	{ good: true, type: story, hid: 'sword_in_a_lake',              outcome: { weapon:true }},
	{ good: true, type: story, hid: 'lost_mine',                    outcome: { token: 1 }},
	{ good: true, type: story, hid: 'vampire_castle',               outcome: { coin:'gainꘌmedium', armor_or_weapon:true }},
	{ good: true, type: story, hid: 'mana_mana',                    outcome: { mana:true }},
	{ good: true, type: story, hid: 'square_eggs',                  outcome: { luck:true }},

	{ good: true, type: story, hid: 'foodie_friend',                outcome: { health:true }},
	{ good: true, type: story, hid: 'chilies',                      outcome: { class_primary_attribute:true }},
	{ good: true, type: story, hid: 'caravan_failure',              outcome: { coin:'gainꘌmedium', armor_or_weapon:true }},
	{ good: true, type: story, hid: 'meet_old_wizard',              outcome: { wisdom:true }},
	{ good: true, type: story, hid: 'always_keep_potions',          outcome: { health:true }},
	{ good: true, type: story, hid: 'lost',                         outcome: { health:true }},
	{ good: true, type: story, hid: 'grinding',                     outcome: { level:true }},
	{ good: true, type: story, hid: 'keep_watch',                   outcome: { coin:'gainꘌsmall' }},
	{ good: true, type: story, hid: 'critters',                     outcome: { class_secondary_attribute:true }},
	{ good: true, type: story, hid: 'class_grimoire',               outcome: { class_primary_attribute:true }},

	{ good: true, type: story, hid: 'village_farmwork',             outcome: { coin:'gainꘌsmall', strength:true }},
	{ good: true, type: story, hid: 'village_lost_kid',             outcome: { armor_or_weapon:true }},
	{ good: true, type: story, hid: 'village_lost_father',          outcome: { class_primary_attribute:true }},
	{ good: true, type: story, hid: 'village_nice_daughter',        outcome: { charisma:true }},
	{ good: true, type: story, hid: 'village_gifts_blacksmith',     outcome: { armor:true }},
	{ good: true, type: story, hid: 'village_strongman',            outcome: { strength:true }},

	{ good: true, type: story, hid: 'capital_castle',               outcome: { wisdom:true }},
	{ good: true, type: story, hid: 'capital_royal_road',           outcome: { improvementⵧarmor_or_weapon:true }},
	{ good: true, type: story, hid: 'capital_royal_amusement_park', outcome: { class_primary_attribute:true }},

	{ good: true, type: story, hid: 'famous_stone_ruby',            outcome: { token: 1, charisma:true }},
	{ good: true, type: story, hid: 'famous_stone_diamond',         outcome: { token: 1, wisdom:true }},
	{ good: true, type: story, hid: 'famous_stone_sapphire',        outcome: { token: 1, mana:true }},
	{ good: true, type: story, hid: 'famous_stone_emerald',         outcome: { token: 1, agility:true }},

	{ good: true, type: story, hid: 'class_master_primary_attr_1',      outcome: { class_primary_attribute:true }},
	{ good: true, type: story, hid: 'class_master_primary_attr_2',      outcome: { class_primary_attribute:true }},
	{ good: true, type: story, hid: 'class_master_second_attr',         outcome: { class_secondary_attribute:true }},
	{ good: true, type: story, hid: 'class_master_forbidden_knowledge', outcome: { class_secondary_attribute:true }},
	{ good: true, type: story, hid: 'class_master_dark_holocron',       outcome: { class_primary_attribute:true }},
	{ good: true, type: story, hid: 'class_master_coolidge',            outcome: { level:true }},
	{ good: true, type: story, hid: 'class_master_half_battle',         outcome: { class_secondary_attribute:true }},

	{ good: true, type: story, hid: 'church_book',                  outcome: { mana:true }},
	{ good: true, type: story, hid: 'church_cellar_prisoner',       outcome: { class_secondary_attribute:true }},
	{ good: true, type: story, hid: 'huge_tower',                   outcome: { armor_or_weapon: true, class_primary_attribute:true }},
	{ good: true, type: story, hid: 'make_friends',                 outcome: { mana:true }},
	{ good: true, type: story, hid: 'milk',                         outcome: { health:true }},
	{ good: true, type: story, hid: 'clover',                       outcome: { luck:true }},
	{ good: true, type: story, hid: 'horseshoe',                    outcome: { luck:true }},
	{ good: true, type: story, hid: 'rabbit_foot',                  outcome: { luck:true }},

	{ good: true, type: story, hid: 'erika',                        outcome: { mana:true }},
	{ good: true, type: story, hid: 'rachel',                       outcome: { strength:true }},
	{ good: true, type: story, hid: 'ribert',                       outcome: {class_primary_attribute:true }},

	{ good: true, type: story, hid: 'meteor_metal',                 outcome: { improvementⵧarmor_or_weapon:true }},
	{ good: true, type: story, hid: 'king_reward',                  outcome: { armor_or_weapon: true, token: 1 }},

	{ good: true, type: story, hid: 'pet_squirrel',                 outcome: { agility:true }},
	{ good: true, type: story, hid: 'pet_black_cat',                outcome: { luck:true }},
	{ good: true, type: story, hid: 'pet_rainbow_lorikeet',         outcome: { charisma:true }},
	{ good: true, type: story, hid: 'pet_red_eyed_unicorn',         outcome: { mana:true }},
	{ good: true, type: story, hid: 'pet_badger_mushrooms',         outcome: { strength:true }},

	{ good: true, type: story, hid: 'best_defense_is_offense',      outcome: { improvementⵧarmor_or_weapon:true }},
	{ good: true, type: story, hid: 'defense_is_also_important',    outcome: { improvementⵧarmor:true }},

	// those stories are not hinting a a specific attribute,
	// thus can be used for adjusting distribution.
	// (if aligned, use 'random_attribute')
	{ good: true, type: story, hid: 'cookies_grandmas',             outcome: { agility:true }},
	{ good: true, type: story, hid: 'found_random_mushroom',        outcome: { agility:true }},
	{ good: true, type: story, hid: 'dragon_kebab',                 outcome: { lowest_attribute:true }},
	{ good: true, type: story, hid: 'elven_hydromel',               outcome: { health:true }},
	{ good: true, type: story, hid: 'random_blessing',              outcome: { strength:true }},
	{ good: true, type: story, hid: 'guild_party_food',             outcome: { agility:true }},
	{ good: true, type: story, hid: 'found_vermilion_potion',       outcome: { luck:true }},
	{ good: true, type: story, hid: 'found_silver_potion',          outcome: { agility:true }},
	{ good: true, type: story, hid: 'found_swirling_potion',        outcome: { strength:true }},
	{ good: true, type: story, hid: 'found_fizzing_potion',         outcome: { strength:true }},
	{ good: true, type: story, hid: 'found_bubbly_potion',          outcome: { luck:true }},
	{ good: true, type: story, hid: 'found_worn_out_potion',        outcome: { health:true }},
	{ good: true, type: story, hid: 'found_journal',                outcome: { health:true }},

	// special
	{ good: true, type: story, hid: 'found_coin',                   outcome: { coin:'gainꘌone' }},
]


const i18n_messages: Readonly<I18nMessages> = {
	en,
}



export {
	RawAdventureArchetypeEntry,
	ENTRIES,
	i18n_messages,
}
