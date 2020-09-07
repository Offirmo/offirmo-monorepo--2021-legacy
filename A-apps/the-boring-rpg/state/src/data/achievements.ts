import { ItemQuality, InventorySlot, ITEM_QUALITIES_TO_INT, ITEM_SLOTS } from '@oh-my-rpg/definitions'
import { appraise_sell_value, appraise_power } from '@oh-my-rpg/logic-shop'
import { AchievementStatus, AchievementDefinition } from '@oh-my-rpg/state-progress'
import { CharacterClass, DEFAULT_AVATAR_NAME } from '@oh-my-rpg/state-character'
import { get_item_in_slot } from '@oh-my-rpg/state-inventory'
import { Weapon, matches as matches_weapon } from '@oh-my-rpg/logic-weapons'
import { Armor, matches as matches_armor } from '@oh-my-rpg/logic-armors'
import { ALL_GOOD_ADVENTURE_ARCHETYPES } from '@oh-my-rpg/logic-adventures'

import { UState } from '../types'
import { STARTING_ARMOR_SPEC, STARTING_WEAPON_SPEC } from '../reducers/create'

// ’


function _are_all_slots_equipped_with_quality_higher_or_equal_than(u_state: Readonly<UState>, quality: ItemQuality): boolean {
	return ITEM_SLOTS.every(
		slot => {
			const item = get_item_in_slot(u_state.inventory, slot)
			return item ? ITEM_QUALITIES_TO_INT[item.quality] <= ITEM_QUALITIES_TO_INT[quality] : false
		},
	)
}
function _get_combined_equipped_items_power(u_state: Readonly<UState>): number {
	return ITEM_SLOTS.reduce(
		(acc, slot) => {
			const item = get_item_in_slot(u_state.inventory, slot)
			return acc + (item ? appraise_power(item) : 0)
		},
		0,
	)
}
function _equipped_armor_matches(u_state: Readonly<UState>, spec: Readonly<Partial<Armor>>): boolean {
	const armor = u_state.inventory.slotted[InventorySlot.armor]
	return armor
		? matches_armor(armor, spec)
		: false
}
function _equipped_weapon_matches(u_state: Readonly<UState>, spec: Readonly<Partial<Weapon>>): boolean {
	const weapon = u_state.inventory.slotted[InventorySlot.weapon]
	return weapon
		? matches_weapon(weapon, spec)
		: false
}
function _encountered_good_adventures_count(u_state: Readonly<UState>): number {
	return Object.keys(u_state.progress.statistics.encountered_adventures).length
}
function _encountered_fight_adventures_count(u_state: Readonly<UState>): number {
	return u_state.progress.statistics.fight_won_count + u_state.progress.statistics.fight_lost_count
}
function _eaten_mushroom_count(u_state: Readonly<UState>): number {
	return Object.keys(u_state.progress.statistics.encountered_adventures)
		.filter(k => k.endsWith('_mushroom'))
		.length
}
function _drunk_potion_count(u_state: Readonly<UState>): number {
	return Object.keys(u_state.progress.statistics.encountered_adventures)
		.filter(k => k.endsWith('_potion'))
		.length
}
function _helped_village_count(u_state: Readonly<UState>): number {
	return Object.keys(u_state.progress.statistics.encountered_adventures)
		.filter(k => k.startsWith('village_'))
		.length
}
function _famous_stones_count(u_state: Readonly<UState>): number {
	return Object.keys(u_state.progress.statistics.encountered_adventures)
		.filter(k => k.startsWith('famous_stone_'))
		.length
}

const RAW_ENTRIES_TEST: Readonly<Partial<AchievementDefinition<UState>>>[] = [
	{
		icon: '🍪',
		name: 'TEST',
		description: 'This secret achievement can only be obtained through debug commands, to test the achievements system.',
		lore: '…and a piece of lore should appear here',
		get_status: (u_state: UState) => u_state.progress.achievements['TEST'] === undefined || u_state.progress.achievements['TEST'] === AchievementStatus.secret
			? AchievementStatus.secret // keep it secret
			: AchievementStatus.unlocked, // unlock it ASAP
	},
	{
		icon: '🧒',
		name: 'Reborn!',
		description: 'This secret achievement can only be obtained if you got "reborn" = your savegame was reinitialised with an autoplay due to a new format being introduced. This can only happen during the alpha.',
		lore: 'I won’t waste this new chance! I’ll live my life to the fullest!',
		get_status: (u_state: UState) => u_state.progress.achievements['Reborn!'] === AchievementStatus.unlocked
			? AchievementStatus.unlocked // keep it unlocked
			: AchievementStatus.secret, // keep it secret
	},
]

const RAW_ENTRIES_GAME_PHASES: Readonly<Partial<AchievementDefinition<UState>>>[] = [
	{
		icon: '🐺',
		name: 'Alpha player',
		description: 'You started playing during the alpha or earlier.',
		lore: 'Let me tell you of a time of great adventure…',
		get_status: () => AchievementStatus.unlocked, // TODO alpha
	},
	{
		icon: '🦍',
		name: 'Beta player',
		description: 'You played during the beta. (no beta yet, though)',
		lore: 'Those were the days my friend…',
		get_status: () => AchievementStatus.revealed, // TODO beta
	},
]

const ADVENTURE_TIERS = [1, 5, 10, 25, 50, 100, 150]
const RAW_ENTRIES_ADVENTURING: Readonly<Partial<AchievementDefinition<UState>>>[] = [
	{
		icon: '🥉',
		name: 'Aspiring Explorer',
		description: `Having experienced ${ADVENTURE_TIERS[1]} different adventures`,
		get_status: (u_state: UState) => _encountered_good_adventures_count(u_state) >= ADVENTURE_TIERS[1]
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
	},
	{
		icon: '🥈',
		name: 'Rookie Explorer',
		description: `Having experienced ${ADVENTURE_TIERS[2]} different adventures`,
		get_status: (u_state: UState) => _encountered_good_adventures_count(u_state) >= ADVENTURE_TIERS[2]
			? AchievementStatus.unlocked
			: _encountered_good_adventures_count(u_state) >= ADVENTURE_TIERS[1]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([_encountered_good_adventures_count(u_state), ADVENTURE_TIERS[2]]),
	},
	{
		icon: '🥇',
		name: 'Young Explorer',
		description: `Having experienced ${ADVENTURE_TIERS[3]} different adventures`,
		get_status: (u_state: UState) => _encountered_good_adventures_count(u_state) >= ADVENTURE_TIERS[3]
			? AchievementStatus.unlocked
			: _encountered_good_adventures_count(u_state) >= ADVENTURE_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([_encountered_good_adventures_count(u_state), ADVENTURE_TIERS[3]]),
	},
	{
		icon: '🏅',
		name: 'Master Explorer',
		description: `Having experienced ${ADVENTURE_TIERS[4]} different adventures`,
		get_status: (u_state: UState) => _encountered_good_adventures_count(u_state) >= ADVENTURE_TIERS[4]
			? AchievementStatus.unlocked
			: _encountered_good_adventures_count(u_state) >= ADVENTURE_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([_encountered_good_adventures_count(u_state), ADVENTURE_TIERS[4]]),
	},
	{
		icon: '🎖',
		name: 'Senior Explorer',
		description: `Having experienced ${ADVENTURE_TIERS[5]} different adventures`,
		get_status: (u_state: UState) => _encountered_good_adventures_count(u_state) >= ADVENTURE_TIERS[5]
			? AchievementStatus.unlocked
			: _encountered_good_adventures_count(u_state) >= ADVENTURE_TIERS[4]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([_encountered_good_adventures_count(u_state), ADVENTURE_TIERS[5]]),
	},
	{
		icon: '🏆',
		name: 'Grandmaster Explorer',
		description: `Having experienced ${ADVENTURE_TIERS[6]} different adventures`,
		get_status: (u_state: UState) => _encountered_good_adventures_count(u_state) >= ADVENTURE_TIERS[6]
			? AchievementStatus.unlocked
			: _encountered_good_adventures_count(u_state) >= ADVENTURE_TIERS[5]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([_encountered_good_adventures_count(u_state), ADVENTURE_TIERS[6]]),
	},

	{
		icon: '👑',
		name: 'Absolute Explorer',
		description: 'Having experienced ALL the adventures',
		get_status: (u_state: UState) => _encountered_good_adventures_count(u_state) >= ALL_GOOD_ADVENTURE_ARCHETYPES.length
			? AchievementStatus.unlocked
			: _encountered_good_adventures_count(u_state) >= ADVENTURE_TIERS[6]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([_encountered_good_adventures_count(u_state), ALL_GOOD_ADVENTURE_ARCHETYPES.length]),
	},
]

const FIGHT_ENCOUNTER_TIERS = [1, 3, 10, 49, 50, 100, 500]
const RAW_ENTRIES_FIGHT_ENCOUNTERS: Readonly<Partial<AchievementDefinition<UState>>>[] = [
	{
		icon: '🥄',
		name: 'First Blood',
		description: 'Having experienced your first random fight encounter.',
		get_status: (u_state: UState) => _encountered_fight_adventures_count(u_state) >= FIGHT_ENCOUNTER_TIERS[0]
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
	},
	{
		icon: '🔨',
		name: 'Into The Wild',
		description: `Having experienced ${FIGHT_ENCOUNTER_TIERS[1]} random fight encounters.`,
		get_status: (u_state: UState) => _encountered_fight_adventures_count(u_state) >= FIGHT_ENCOUNTER_TIERS[1]
			? AchievementStatus.unlocked
			: _encountered_fight_adventures_count(u_state) >= FIGHT_ENCOUNTER_TIERS[0]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([_encountered_fight_adventures_count(u_state), FIGHT_ENCOUNTER_TIERS[1]]),
	},
	{
		icon: '⛏',
		name: 'Born To Be Wild',
		description: `Having experienced ${FIGHT_ENCOUNTER_TIERS[2]} random fight encounters.`,
		get_status: (u_state: UState) => _encountered_fight_adventures_count(u_state) >= FIGHT_ENCOUNTER_TIERS[2]
			? AchievementStatus.unlocked
			: _encountered_fight_adventures_count(u_state) >= FIGHT_ENCOUNTER_TIERS[1]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([_encountered_fight_adventures_count(u_state), FIGHT_ENCOUNTER_TIERS[2]]),
	},
	{
		icon: '🔪',
		name: '49 times… It was 49 times…',
		description: 'Having experienced 49 random fight encounters.',
		lore: '49 times… We fought that beast. Something’s waiting in the bushes for us…',
		get_status: (u_state: UState) => _encountered_fight_adventures_count(u_state) >= FIGHT_ENCOUNTER_TIERS[3]
			? AchievementStatus.unlocked
			: _encountered_fight_adventures_count(u_state) >= FIGHT_ENCOUNTER_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([_encountered_fight_adventures_count(u_state), FIGHT_ENCOUNTER_TIERS[3]]),
	},
	{
		icon: '🔪',
		name: 'Wild Like The Wind',
		description: `Having experienced ${FIGHT_ENCOUNTER_TIERS[4]} random fight encounters.`,
		get_status: (u_state: UState) => _encountered_fight_adventures_count(u_state) >= FIGHT_ENCOUNTER_TIERS[4]
			? AchievementStatus.unlocked
			: _encountered_fight_adventures_count(u_state) >= FIGHT_ENCOUNTER_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([_encountered_fight_adventures_count(u_state), FIGHT_ENCOUNTER_TIERS[4]]),
	},
	{
		icon: '🗡',
		name: 'The Wild One',
		description: `Having experienced ${FIGHT_ENCOUNTER_TIERS[5]} random fight encounters.`,
		get_status: (u_state: UState) => _encountered_fight_adventures_count(u_state) >= FIGHT_ENCOUNTER_TIERS[5]
			? AchievementStatus.unlocked
			: _encountered_fight_adventures_count(u_state) >= FIGHT_ENCOUNTER_TIERS[4]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([_encountered_fight_adventures_count(u_state), FIGHT_ENCOUNTER_TIERS[5]]),
	},
	{
		icon: '⚔',
		name: 'Alpha Of The Wilderness',
		description: `Having experienced ${FIGHT_ENCOUNTER_TIERS[6]} random fight encounters.`,
		get_status: (u_state: UState) => _encountered_fight_adventures_count(u_state) >= FIGHT_ENCOUNTER_TIERS[6]
			? AchievementStatus.unlocked
			: _encountered_fight_adventures_count(u_state) >= FIGHT_ENCOUNTER_TIERS[5]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([_encountered_fight_adventures_count(u_state), FIGHT_ENCOUNTER_TIERS[6]]),
	},
]

const RAW_ENTRIES_ADVENTURES_SETS: Readonly<Partial<AchievementDefinition<UState>>>[] = [
	{
		icon: '🍄',
		name: 'Mushrooms Lover',
		description: 'Having eaten 3 different mushrooms.',
		get_status: (u_state: UState) => _eaten_mushroom_count(u_state) >= 3
			? AchievementStatus.unlocked
			: _eaten_mushroom_count(u_state) >= 1
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([_eaten_mushroom_count(u_state), 3]),
	},
	{
		icon: '🍡',
		name: 'Mushrooms Gourmet',
		description: 'Having eaten all the different mushrooms.',
		get_status: (u_state: UState) => _eaten_mushroom_count(u_state) >= 8
			? AchievementStatus.unlocked
			: _eaten_mushroom_count(u_state) >= 3
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([_eaten_mushroom_count(u_state), 8]),
	},

	{
		icon: '🥤',
		name: 'Potions Taster',
		description: 'Having drunk 3 different potions.',
		get_status: (u_state: UState) => _drunk_potion_count(u_state) >= 3
			? AchievementStatus.unlocked
			: _drunk_potion_count(u_state) >= 1
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([_drunk_potion_count(u_state), 3]),
	},
	{
		icon: '🍹',
		name: 'Potions Sommelier',
		description: 'Having drunk all the different potions.',
		get_status: (u_state: UState) => _drunk_potion_count(u_state) >= 6
			? AchievementStatus.unlocked
			: _drunk_potion_count(u_state) >= 3
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([_drunk_potion_count(u_state), 6]),
	},

	{
		icon: '👩‍🌾',
		name: 'Folk Hero',
		description: 'Having completed all the village quests.',
		get_status: (u_state: UState) => _helped_village_count(u_state) >= 6
			? AchievementStatus.unlocked
			: _helped_village_count(u_state) >= 1
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([_helped_village_count(u_state), 6]),
	},

	{
		icon: '💎',
		name: 'Famous Gems Collector',
		description: 'Having collected all the famous gems.',
		get_status: (u_state: UState) => _famous_stones_count(u_state) >= 4
			? AchievementStatus.unlocked
			: _famous_stones_count(u_state) >= 1
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([_famous_stones_count(u_state), 4]),
	},

	// all class master
	// all pets
	// all npc
]


const GOOD_CLICKS_TIERS = [1, 7, 11, 77, 500, 1000, 10_000]
const RAW_ENTRIES_PRIMARY_CTA: Readonly<Partial<AchievementDefinition<UState>>>[] = [
	{
		icon: '🥉',
		name: 'I am bored',
		description: 'Having played for the first time.',
		lore: 'I am looking for someone to share in an adventure…',
		get_status: (u_state: UState) => u_state.progress.statistics.good_play_count
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
	},
	{
		icon: '🥈',
		name: 'I am very bored',
		description: `Having played ${GOOD_CLICKS_TIERS[1]} times.`,
		lore: 'If I take one more step, I’ll be the farthest away from home I’ve ever been…',
		get_status: (u_state: UState) => u_state.progress.statistics.good_play_count >= GOOD_CLICKS_TIERS[1]
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
		get_completion_rate: (u_state: UState) => ([u_state.progress.statistics.good_play_count, GOOD_CLICKS_TIERS[1]]),
	},
	{
		icon: '🥇',
		// https://www.urbandictionary.com/define.php?term=Turn%20it%20up%20to%20eleven
		name: 'Turn it up to eleven',
		description: `Having played ${GOOD_CLICKS_TIERS[2]} times.`,
		lore: 'You step onto the road, and there’s no telling where you might be swept off to…',
		get_status: (u_state: UState) => u_state.progress.statistics.good_play_count >= GOOD_CLICKS_TIERS[2]
			? AchievementStatus.unlocked
			: u_state.progress.statistics.good_play_count >= GOOD_CLICKS_TIERS[1]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.progress.statistics.good_play_count, GOOD_CLICKS_TIERS[2]]),
	},
	{
		icon: '🏅',
		name: 'I am dead bored',
		description: `Having played ${GOOD_CLICKS_TIERS[3]} times.`,
		lore: 'Not all those who wander are lost.',
		get_status: (u_state: UState) => u_state.progress.statistics.good_play_count >= GOOD_CLICKS_TIERS[3]
			? AchievementStatus.unlocked
			: u_state.progress.statistics.good_play_count >= GOOD_CLICKS_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.progress.statistics.good_play_count, GOOD_CLICKS_TIERS[3]]),
	},
	{
		icon: '🎖',
		name: 'did I mention I was bored?',
		description: `Having played ${GOOD_CLICKS_TIERS[4]} times.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.progress.statistics.good_play_count >= GOOD_CLICKS_TIERS[4]
			? AchievementStatus.unlocked
			: u_state.progress.statistics.good_play_count >= GOOD_CLICKS_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.progress.statistics.good_play_count, GOOD_CLICKS_TIERS[4]]),
	},
	{
		icon: '👑',
		name: 'king of boredom',
		description: `Having played ${GOOD_CLICKS_TIERS[5]} times.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.progress.statistics.good_play_count >= GOOD_CLICKS_TIERS[5]
			? AchievementStatus.unlocked
			: u_state.progress.statistics.good_play_count >= GOOD_CLICKS_TIERS[4]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.progress.statistics.good_play_count, GOOD_CLICKS_TIERS[5]]),
	},
	{
		icon: '🏆',
		name: 'No-life except for boredom',
		description: `Having played ${GOOD_CLICKS_TIERS[6]} times.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.progress.statistics.good_play_count >= GOOD_CLICKS_TIERS[6]
			? AchievementStatus.unlocked
			: u_state.progress.statistics.good_play_count >= GOOD_CLICKS_TIERS[5]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.progress.statistics.good_play_count, GOOD_CLICKS_TIERS[6]]),
	},
]

const BAD_CLICKS_TIERS = [0, 1, 2, 10, 50, 500]
const RAW_ENTRIES_COUNTER_CTA: Readonly<Partial<AchievementDefinition<UState>>>[] = [
	// = bad clicks
	{
		icon: '😱',
		name: 'Sorry my hand slipped',
		description: 'Having played too soon for the 1st time.',
		lore: 'each mistake teaches us something…',
		get_status: (u_state: UState) => u_state.progress.statistics.bad_play_count
			? AchievementStatus.unlocked
			: AchievementStatus.hidden,
	},
	{
		icon: '🙀',
		name: 'Oops!... I Did It Again',
		description: 'Having played too soon for the 2nd time.',
		lore: 'Anyone who has never made a mistake has never tried anything new.',
		get_status: (u_state: UState) => u_state.progress.statistics.bad_play_count >= BAD_CLICKS_TIERS[2]
			? AchievementStatus.unlocked
			: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.progress.statistics.bad_play_count, BAD_CLICKS_TIERS[2]]),
	},
	{
		icon: '😼',
		name: 'I’m not that innocent',
		description: `Having played too soon ${BAD_CLICKS_TIERS[3]} times.`,
		lore: 'There is no such thing as accident; it is fate misnamed.',
		get_status: (u_state: UState) => u_state.progress.statistics.bad_play_count >= BAD_CLICKS_TIERS[3]
			? AchievementStatus.unlocked
			: u_state.progress.statistics.bad_play_count >= BAD_CLICKS_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.progress.statistics.bad_play_count, BAD_CLICKS_TIERS[3]]),
	},
	{
		icon: '😈',
		name: 'It’s good to be bad',
		description: `Having played too soon ${BAD_CLICKS_TIERS[4]} times.`,
		lore: 'Never retreat, never retract… never admit a mistake…',
		get_status: (u_state: UState) => u_state.progress.statistics.bad_play_count >= BAD_CLICKS_TIERS[4]
			? AchievementStatus.unlocked
			: u_state.progress.statistics.bad_play_count >= BAD_CLICKS_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.progress.statistics.bad_play_count, BAD_CLICKS_TIERS[4]]),
	},
	{
		icon: '👻',
		name: 'Hello darkness my old friend',
		description: `Having played too soon ${BAD_CLICKS_TIERS[5]} times.`,
		lore: 'Give yourself to the dark side…',
		get_status: (u_state: UState) => u_state.progress.statistics.bad_play_count >= BAD_CLICKS_TIERS[5]
			? AchievementStatus.unlocked
			: u_state.progress.statistics.bad_play_count >= BAD_CLICKS_TIERS[4]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.progress.statistics.bad_play_count, BAD_CLICKS_TIERS[5]]),
	},
]

const REGULARITY_TIERS = [1, 2, 3, 7, 30, 120, 365]
const RAW_ENTRIES_SECONDARY_CTAS: Readonly<Partial<AchievementDefinition<UState>>>[] = [
	// regularity
	{
		icon: '🌱',
		name: 'I’ll Be Back',
		description: `Having been playing for ${REGULARITY_TIERS[1]} days.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.progress.statistics.active_day_count >= REGULARITY_TIERS[1]
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
		get_completion_rate: (u_state: UState) => ([u_state.progress.statistics.active_day_count, REGULARITY_TIERS[1]]),
	},
	{
		icon: '🌿',
		name: 'I Am Back',
		description: `Having been playing for ${REGULARITY_TIERS[2]} days.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.progress.statistics.active_day_count >= REGULARITY_TIERS[2]
			? AchievementStatus.unlocked
			: u_state.progress.statistics.active_day_count >= REGULARITY_TIERS[1]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.progress.statistics.active_day_count, REGULARITY_TIERS[2]]),
	},
	{
		icon: '🌲',
		name: 'Regular',
		description: `Having been playing for ${REGULARITY_TIERS[3]} days.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.progress.statistics.active_day_count >= REGULARITY_TIERS[3]
			? AchievementStatus.unlocked
			: u_state.progress.statistics.active_day_count >= REGULARITY_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.progress.statistics.active_day_count, REGULARITY_TIERS[3]]),
	},
	{
		icon: '🌳',
		name: 'Faithful',
		description: `Having been playing for ${REGULARITY_TIERS[4]} days.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.progress.statistics.active_day_count >= REGULARITY_TIERS[4]
			? AchievementStatus.unlocked
			: u_state.progress.statistics.active_day_count >= REGULARITY_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.progress.statistics.active_day_count, REGULARITY_TIERS[4]]),
	},
	{
		icon: '💉',
		name: 'Hooked',
		description: `Having been playing for ${REGULARITY_TIERS[5]} days.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.progress.statistics.active_day_count >= REGULARITY_TIERS[5]
			? AchievementStatus.unlocked
			: u_state.progress.statistics.active_day_count >= REGULARITY_TIERS[4]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.progress.statistics.active_day_count, REGULARITY_TIERS[5]]),
	},
	{
		icon: '🎂',
		name: 'Addicted',
		description: `Having been playing for ${REGULARITY_TIERS[6]} days.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.progress.statistics.active_day_count >= REGULARITY_TIERS[6]
			? AchievementStatus.unlocked
			: u_state.progress.statistics.active_day_count >= REGULARITY_TIERS[5]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.progress.statistics.active_day_count, REGULARITY_TIERS[6]]),
	},
]

const RAW_ENTRIES_ENGAGEMENT: Readonly<Partial<AchievementDefinition<UState>>>[] = [
	{
		icon: '🎫',
		name: 'What’s in a name?',
		description: 'Having set one’s name.',
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.avatar.name !== DEFAULT_AVATAR_NAME
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
	},
	{
		icon: '🎓',
		name: 'Graduated',
		description: 'Having selected a class.',
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.avatar.klass !== CharacterClass.novice
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
	},
	{
		icon: '🆔',
		name: 'Registered',
		description: 'Having signed up.',
		// lore: 'TODO',
		// TODO make that unlock new adventures
	},
]

const POWER_TIERS = [0, 5_000, 20_000, 60_000, 120_000, 180_000]
const RAW_ENTRIES_PROGRESSION_EQUIPMENT: Readonly<Partial<AchievementDefinition<UState>>>[] = [
	{
		icon: '🥄',
		name: 'There Is No Spoon',
		description: 'Having replaced your starting "spoon of the noob" weapon.',
		lore: 'A weapon isn’t good or bad, depends on the person who uses it.',
		get_status: (u_state: UState) => (!u_state.inventory.slotted[InventorySlot.weapon] || _equipped_weapon_matches(u_state, STARTING_WEAPON_SPEC))
			? AchievementStatus.revealed
			: AchievementStatus.unlocked,
	},
	{
		icon: '🧦',
		name: 'They Weren’t Matched Anyway',
		description: 'Having replaced your starting "socks of the noob" armor.',
		lore: 'I’ll tell you one thing you can’t do: you can’t put your shoes on, then your socks on.',
		get_status: (u_state: UState) => (!u_state.inventory.slotted[InventorySlot.armor] || _equipped_armor_matches(u_state, STARTING_ARMOR_SPEC))
			? AchievementStatus.revealed
			: AchievementStatus.unlocked,
	},
	{
		icon: '🎒',
		name: 'I Was Born Ready',
		description: 'Having replaced all your starting "spoon+socks" equipment.',
		// lore: 'TODO',
		get_status: (u_state: UState) => _equipped_armor_matches(u_state, STARTING_ARMOR_SPEC) || _equipped_weapon_matches(u_state, STARTING_WEAPON_SPEC)
			? AchievementStatus.revealed
			: AchievementStatus.unlocked,
		get_completion_rate: (u_state: UState) => ([
			(_equipped_armor_matches(u_state, STARTING_ARMOR_SPEC) ? 0 : 1)
			+ (_equipped_weapon_matches(u_state, STARTING_WEAPON_SPEC) ? 0 : 1),
			2,
		]),
	},

	// - quality
	{
		icon: '🛍',
		name: 'U Got The Look',
		description: 'All equipped items of quality uncommon or higher. 💚 ',
		lore: 'If there are cracks in your armor, your opponent is going to find them...',
		get_status: (u_state: UState) => _are_all_slots_equipped_with_quality_higher_or_equal_than(u_state, ItemQuality.uncommon)
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
	},
	{
		icon: '💅',
		name: 'Rare Sight',
		description: 'All equipped items of quality rare or higher. 💙 ',
		// lore: 'TODO',
		get_status: (u_state: UState) => _are_all_slots_equipped_with_quality_higher_or_equal_than(u_state, ItemQuality.rare)
			? AchievementStatus.unlocked
			: _are_all_slots_equipped_with_quality_higher_or_equal_than(u_state, ItemQuality.uncommon)
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
	},
	{
		icon: '🎩',
		name: 'Epic Smile',
		description: 'All equipped items of quality epic or higher. 💜 ',
		// lore: 'TODO',
		get_status: (u_state: UState) => _are_all_slots_equipped_with_quality_higher_or_equal_than(u_state, ItemQuality.epic)
			? AchievementStatus.unlocked
			: _are_all_slots_equipped_with_quality_higher_or_equal_than(u_state, ItemQuality.rare)
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
	},
	{
		icon: '👑',
		name: 'I Am A Legend',
		description: 'All equipped items of quality legendary or higher. 🧡 ',
		// lore: 'TODO',
		get_status: (u_state: UState) => _are_all_slots_equipped_with_quality_higher_or_equal_than(u_state, ItemQuality.legendary)
			? AchievementStatus.unlocked
			: _are_all_slots_equipped_with_quality_higher_or_equal_than(u_state, ItemQuality.epic)
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
	},
	{
		icon: '🌞',
		name: 'Twinkle Twinkle Little Star',
		description: 'All equipped items of quality artifact or higher. 💛 ',
		// lore: 'TODO',
		get_status: (u_state: UState) => _are_all_slots_equipped_with_quality_higher_or_equal_than(u_state, ItemQuality.artifact)
			? AchievementStatus.unlocked
			: AchievementStatus.hidden, // since artifact can't be obtained by normal means
	},

	// - power
	{
		icon: '🐸',
		name: 'Frog In A Well',
		description: `Having a combined equipment’s power of ${POWER_TIERS[1]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => _get_combined_equipped_items_power(u_state) >= POWER_TIERS[1]
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
		get_completion_rate: (u_state: UState) => ([_get_combined_equipped_items_power(u_state), POWER_TIERS[1]]),
	},
	{
		icon: '👙',
		name: 'Looking Like something',
		description: `Having a combined equipment’s power of ${POWER_TIERS[2]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => _get_combined_equipped_items_power(u_state) >= POWER_TIERS[2]
			? AchievementStatus.unlocked
			: _get_combined_equipped_items_power(u_state) >= POWER_TIERS[1]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([_get_combined_equipped_items_power(u_state), POWER_TIERS[2]]),
	},
	{
		icon: '🎁',
		name: 'Formal Adventurer',
		description: `Having a combined equipment’s power of ${POWER_TIERS[3]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => _get_combined_equipped_items_power(u_state) >= POWER_TIERS[3]
			? AchievementStatus.unlocked
			: _get_combined_equipped_items_power(u_state) >= POWER_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([_get_combined_equipped_items_power(u_state), POWER_TIERS[3]]),
	},
	{
		icon: '🔱',
		name: 'King-looking Adventurer',
		description: `Having a combined equipment’s power of ${POWER_TIERS[4]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => _get_combined_equipped_items_power(u_state) >= POWER_TIERS[4]
			? AchievementStatus.unlocked
			: _get_combined_equipped_items_power(u_state) >= POWER_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([_get_combined_equipped_items_power(u_state), POWER_TIERS[4]]),
	},
	{
		icon: '⚜',
		name: 'Emperor-Looking Adventurer',
		description: `Having a combined equipment’s power of ${POWER_TIERS[5]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => _get_combined_equipped_items_power(u_state) >= POWER_TIERS[5]
			? AchievementStatus.unlocked
			: _get_combined_equipped_items_power(u_state) >= POWER_TIERS[4]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([_get_combined_equipped_items_power(u_state), POWER_TIERS[5]]),
	},
]

const ATTRIBUTES_TIERS = [1, 10, 33, 66, 100]
const RAW_ENTRIES_PROGRESSION_ATTRIBUTES: Readonly<Partial<AchievementDefinition<UState>>>[] = [

	/////// LEVEL ///////
	// https://en.uesp.net/wiki/Oblivion:Leveling
	{
		icon: '👶',
		name: 'Tiny Adventurer',
		description: 'Having a level of 3 or higher.',
		lore: 'You realize that all your life you have been coasting along as if you were in a dream. Suddenly, facing the trials of the last few days, you have come alive.',
		get_status: (u_state: UState) => u_state.avatar.attributes.level >= 3
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.level, 3]),
	},
	{
		icon: '🧒',
		name: 'Reasonable Adventurer',
		description: 'Having a level of 7 or higher.',
		lore: 'Today you wake up, full of energy and ideas, and you know, somehow, that overnight everything has changed. What a difference a day makes.',
		get_status: (u_state: UState) => u_state.avatar.attributes.level >= 7
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.level >= 3
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.level, 7]),
	},
	{
		icon: '👩‍🎤',
		name: 'Teenage Adventurer',
		description: 'Having a level of 12 or higher.',
		lore: 'You’ve done things the hard way. But without taking risks, taking responsibility for failure... how could you have understood?',
		get_status: (u_state: UState) => u_state.avatar.attributes.level >= 12
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.level >= 7
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.level, 12]),
	},
	{
		icon: '🧑',
		name: 'Newbie Adventurer',
		description: 'Having a level of 20 or higher.',
		lore: 'Being smart doesn’t hurt. And a little luck now and then is nice. But the key is patience and hard work.',
		get_status: (u_state: UState) => u_state.avatar.attributes.level >= 20
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.level >= 12
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.level, 20]),
	},
	{
		icon: '🧑',
		name: 'Seasoned Adventurer',
		description: `Having a level of ${ATTRIBUTES_TIERS[2]} or higher.`,
		lore: 'You resolve to continue pushing yourself. Perhaps there’s more to you than you thought.',
		get_status: (u_state: UState) => u_state.avatar.attributes.level >= ATTRIBUTES_TIERS[2]
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.level >= 20
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.level, ATTRIBUTES_TIERS[2]]),
	},
	{
		icon: '🧓',
		name: 'Grey Haired Adventurer',
		description: `Having a level of ${ATTRIBUTES_TIERS[3]} or higher.`,
		lore: 'With the life you’ve been living, the punishment your body has taken... there are limits, and maybe you’ve reached them. Is this what it’s like to grow old?',
		get_status: (u_state: UState) => u_state.avatar.attributes.level >= ATTRIBUTES_TIERS[3]
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.level >= ATTRIBUTES_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.level, ATTRIBUTES_TIERS[3]]),
	},
	{
		icon: '🐢',
		name: 'Spirit Of The Tortoise',
		description: `Having a level of ${ATTRIBUTES_TIERS[4]} or higher.`,
		lore: 'So that’s how it works. You plod along, putting one foot before the other, look up, and suddenly, there you are. Right where you wanted to be all along.',
		get_status: (u_state: UState) => u_state.avatar.attributes.level >= ATTRIBUTES_TIERS[4]
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.level >= ATTRIBUTES_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.level, ATTRIBUTES_TIERS[4]]),
	},
	{
		icon: '🧝',
		name: 'Long Lived Adventurer',
		description: 'Having a level of 300 or higher.',
		lore: 'The results of hard work and dedication always look like luck. But you know you’ve earned every ounce of your success.',
		get_status: (u_state: UState) => u_state.avatar.attributes.level >= 300
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.level >= ATTRIBUTES_TIERS[4]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.level, 300]),
	},


	/////// health ///////
	// elephant
	{
		icon: '💪',
		name: 'Light Punishment',
		description: `Having a health of ${ATTRIBUTES_TIERS[1]} or higher.`,
		lore: 'That’s just a scratch...',
		get_status: (u_state: UState) => u_state.avatar.attributes.health >= ATTRIBUTES_TIERS[1]
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.health, ATTRIBUTES_TIERS[1]]),
	},
	{
		icon: '😤',
		name: 'Bring It On',
		description: `Having a health of ${ATTRIBUTES_TIERS[2]} or higher.`,
		lore: 'Not even hurt!',
		get_status: (u_state: UState) => u_state.avatar.attributes.health >= ATTRIBUTES_TIERS[2]
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.health >= ATTRIBUTES_TIERS[1]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.health, ATTRIBUTES_TIERS[2]]),
	},
	{
		icon: '🏋',
		name: 'I Can Handle It',
		description: `Having a health of ${ATTRIBUTES_TIERS[3]} or higher.`,
		lore: 'Is that all you’ve got?',
		get_status: (u_state: UState) => u_state.avatar.attributes.health >= ATTRIBUTES_TIERS[3]
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.health >= ATTRIBUTES_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.health, ATTRIBUTES_TIERS[3]]),
	},
	{
		icon: '🐘',
		name: 'Spirit Of The Elephant',
		description: `Having a health of ${ATTRIBUTES_TIERS[4]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.avatar.attributes.health >= ATTRIBUTES_TIERS[4]
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.health >= ATTRIBUTES_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.health, ATTRIBUTES_TIERS[4]]),
	},

	/////// mana ///////
	{
		icon: '🍼',
		name: 'Awoken',
		description: `Having a mana of ${ATTRIBUTES_TIERS[1]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.avatar.attributes.mana >= ATTRIBUTES_TIERS[1]
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.mana, ATTRIBUTES_TIERS[1]]),
	},
	{
		icon: '🥛',
		name: 'The Power Of The Mind',
		description: `Having a mana of ${ATTRIBUTES_TIERS[2]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.avatar.attributes.mana >= ATTRIBUTES_TIERS[2]
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.mana >= ATTRIBUTES_TIERS[1]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.mana, ATTRIBUTES_TIERS[2]]),
	},
	{
		icon: '☕',
		name: 'Vast Consciousness',
		description: `Having a mana of ${ATTRIBUTES_TIERS[3]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.avatar.attributes.mana >= ATTRIBUTES_TIERS[3]
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.mana >= ATTRIBUTES_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.mana, ATTRIBUTES_TIERS[3]]),
	},
	{
		icon: '🧙',
		name: 'Spirit Of The Human',
		description: `Having a mana of ${ATTRIBUTES_TIERS[4]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.avatar.attributes.mana >= ATTRIBUTES_TIERS[4]
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.mana >= ATTRIBUTES_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.mana, ATTRIBUTES_TIERS[4]]),
	},

	/////// STRENGTH ///////
	{
		icon: '💪',
		name: 'Well Built',
		description: `Having a strength of ${ATTRIBUTES_TIERS[1]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.avatar.attributes.strength >= ATTRIBUTES_TIERS[1]
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.strength, ATTRIBUTES_TIERS[1]]),
	},
	{
		icon: '😤',
		name: 'Local Strongperson',
		description: `Having a strength of ${ATTRIBUTES_TIERS[2]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.avatar.attributes.strength >= ATTRIBUTES_TIERS[2]
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.strength >= ATTRIBUTES_TIERS[1]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.strength, ATTRIBUTES_TIERS[2]]),
	},
	{
		icon: '🏋',
		name: 'Titan',
		description: `Having a strength of ${ATTRIBUTES_TIERS[3]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.avatar.attributes.strength >= ATTRIBUTES_TIERS[3]
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.strength >= ATTRIBUTES_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.strength, ATTRIBUTES_TIERS[3]]),
	},
	{
		icon: '🦍',
		name: 'Spirit Of The Gorilla',
		description: `Having a strength of ${ATTRIBUTES_TIERS[4]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.avatar.attributes.strength >= ATTRIBUTES_TIERS[4]
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.strength >= ATTRIBUTES_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.strength, ATTRIBUTES_TIERS[4]]),
	},

	/////// AGILITY ///////
	{
		icon: '🐥',
		name: 'Small One',
		description: `Having a agility of ${ATTRIBUTES_TIERS[1]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.avatar.attributes.agility >= ATTRIBUTES_TIERS[1]
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.agility, ATTRIBUTES_TIERS[1]]),
	},
	{
		icon: '🤹',
		name: 'Swift One',
		description: `Having a agility of ${ATTRIBUTES_TIERS[2]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.avatar.attributes.agility >= ATTRIBUTES_TIERS[2]
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.agility >= ATTRIBUTES_TIERS[1]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.agility, ATTRIBUTES_TIERS[2]]),
	},
	{
		icon: '🤸',
		name: 'Untouchable',
		description: `Having a agility of ${ATTRIBUTES_TIERS[3]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.avatar.attributes.agility >= ATTRIBUTES_TIERS[3]
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.agility >= ATTRIBUTES_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.agility, ATTRIBUTES_TIERS[3]]),
	},
	{
		icon: '🐒',
		name: 'Spirit Of The Monkey',
		description: `Having a agility of ${ATTRIBUTES_TIERS[4]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.avatar.attributes.agility >= ATTRIBUTES_TIERS[4]
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.agility >= ATTRIBUTES_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.agility, ATTRIBUTES_TIERS[4]]),
	},

	/////// CHARISMA ///////
	// https://www.google.com/search?q=silver+tongue
	{
		icon: '💖',
		name: 'Sharp tongue',
		description: `Having a charisma of ${ATTRIBUTES_TIERS[1]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.avatar.attributes.charisma >= ATTRIBUTES_TIERS[1]
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.charisma, ATTRIBUTES_TIERS[1]]),
	},
	{
		icon: '💓',
		name: 'Silver tongue',
		description: `Having a charisma of ${ATTRIBUTES_TIERS[2]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.avatar.attributes.charisma >= ATTRIBUTES_TIERS[2]
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.charisma >= ATTRIBUTES_TIERS[1]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.charisma, ATTRIBUTES_TIERS[2]]),
	},
	{
		icon: '💋',
		name: 'Golden tongue',
		description: `Having a charisma of ${ATTRIBUTES_TIERS[3]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.avatar.attributes.charisma >= ATTRIBUTES_TIERS[3]
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.charisma >= ATTRIBUTES_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.charisma, ATTRIBUTES_TIERS[3]]),
	},
	{
		icon: '🐈',
		name: 'Spirit Of The Cat', // panda?
		description: `Having a charisma of ${ATTRIBUTES_TIERS[4]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.avatar.attributes.charisma >= ATTRIBUTES_TIERS[4]
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.charisma >= ATTRIBUTES_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.charisma, ATTRIBUTES_TIERS[4]]),
	},

	/////// WISDOM ///////
	//
	{
		icon: '🤓',
		name: 'Bright',
		description: `Having a wisdom of ${ATTRIBUTES_TIERS[1]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.avatar.attributes.wisdom >= ATTRIBUTES_TIERS[1]
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.wisdom, ATTRIBUTES_TIERS[1]]),
	},
	{
		icon: '🧐',
		name: 'Smart',
		description: `Having a wisdom of ${ATTRIBUTES_TIERS[2]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.avatar.attributes.wisdom >= ATTRIBUTES_TIERS[2]
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.wisdom >= ATTRIBUTES_TIERS[1]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.wisdom, ATTRIBUTES_TIERS[2]]),
	},
	{
		icon: '🧓',
		name: 'Sage',
		description: `Having a wisdom of ${ATTRIBUTES_TIERS[3]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.avatar.attributes.wisdom >= ATTRIBUTES_TIERS[3]
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.wisdom >= ATTRIBUTES_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.wisdom, ATTRIBUTES_TIERS[3]]),
	},
	{
		icon: '🦉',
		name: 'Spirit Of The Owl',
		description: `Having a wisdom of ${ATTRIBUTES_TIERS[4]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.avatar.attributes.wisdom >= ATTRIBUTES_TIERS[4]
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.wisdom >= ATTRIBUTES_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.wisdom, ATTRIBUTES_TIERS[4]]),
	},

	/////// LUCK ///////
	// rabbit
	{
		icon: '☘',
		name: 'Sprinkled',
		description: `Having a luck of ${ATTRIBUTES_TIERS[1]} or higher.`,
		lore: 'Luck is great, but most of life is hard work.',
		get_status: (u_state: UState) => u_state.avatar.attributes.luck >= ATTRIBUTES_TIERS[1]
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.luck, ATTRIBUTES_TIERS[1]]),
	},
	{
		icon: '🍀',
		name: 'Blessed',
		description: `Having a luck of ${ATTRIBUTES_TIERS[2]} or higher.`,
		lore: 'The amount of good luck coming your way depends on your willingness to act.',
		get_status: (u_state: UState) => u_state.avatar.attributes.luck >= ATTRIBUTES_TIERS[2]
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.luck >= ATTRIBUTES_TIERS[1]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.luck, ATTRIBUTES_TIERS[2]]),
	},
	{
		icon: '👼',
		name: 'Divinely Touched',
		description: `Having a luck of ${ATTRIBUTES_TIERS[3]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.avatar.attributes.luck >= ATTRIBUTES_TIERS[3]
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.luck >= ATTRIBUTES_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.luck, ATTRIBUTES_TIERS[3]]),
	},
	{
		icon: '🐇',
		name: 'Spirit Of The Rabbit',
		description: `Having a luck of ${ATTRIBUTES_TIERS[4]} or higher.`,
		// lore: 'TODO',
		get_status: (u_state: UState) => u_state.avatar.attributes.luck >= ATTRIBUTES_TIERS[4]
			? AchievementStatus.unlocked
			: u_state.avatar.attributes.luck >= ATTRIBUTES_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (u_state: UState) => ([u_state.avatar.attributes.luck, ATTRIBUTES_TIERS[4]]),
	},
]

const RAW_ENTRIES_MISC: Readonly<Partial<AchievementDefinition<UState>>>[] = [
	{
		icon: '⚔',
		name: 'I Like Swords!',
		description: 'Having equipped a sword once.',
		lore: 'Still sharp...',
		get_status: (u_state: UState) => _equipped_weapon_matches(u_state, { base_hid: 'sword'}) || _equipped_weapon_matches(u_state, { base_hid: 'longsword'})
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
	},
]

const RAW_ENTRIES_META: Readonly<Partial<AchievementDefinition<UState>>>[] = [
	{
		icon: '😇',
		name: 'Supporter of diversity',
		description: 'Having supported web diversity by playing on Firefox once.',
		lore: 'The more the merrier!',
		get_status: (u_state: UState) => u_state.meta.is_web_diversity_supporter
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
	},
	{
		icon: '📃',
		name: 'Registered adventurer',
		description: 'Being logged in.',
		lore: 'You are now a registered adventurer.',
		get_status: (u_state: UState) => u_state.meta.is_logged_in
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
	},
]

const RAW_ENTRIES_SECRETS: Readonly<Partial<AchievementDefinition<UState>>>[] = [
	{
		icon: '👑',
		name: 'Usurper',
		description: 'Having set the name "Offirmo".',
		lore: 'I see you…',
		get_status: (u_state: UState) => u_state.avatar.name === 'Offirmo'
			? AchievementStatus.unlocked
			: AchievementStatus.secret,
	},
	{
		icon: '💣',
		name: 'Blown Away',
		description: 'Having encountered a crash...',
		//lore: 'TODO',
		// TODO
	},
	{
		icon: '🍀',
		name: 'Just plain lucky',
		description: 'You have 1/1000 chance to gain this on each activity.',
		lore: 'The amount of good luck coming your way depends on your willingness to act.',
		get_status: () => Math.floor(Math.random() * 1000) === 123
			? AchievementStatus.unlocked
			: AchievementStatus.secret,
	},
	{
		icon: '🏴‍☠️',
		name: 'Hacker',
		description: 'You manipulated the threads of reality to obtain this achievement. (can’t be obtained by normal means)',
		lore: 'Just a different way of looking at problems that no one’s thought of ;)',
		get_status: (u_state: UState) => AchievementStatus.secret,
	},
]

const RAW_ENTRIES: Readonly<Partial<AchievementDefinition<UState>>>[] = [

	// Intro
	{
		icon: '✨',
		name: 'Summoned',
		description: 'You began your adventures in another world.',
		lore: 'Thanks for visiting!',
		get_status: () => AchievementStatus.unlocked,
	},

	...RAW_ENTRIES_PRIMARY_CTA,
	...RAW_ENTRIES_ENGAGEMENT,
	...RAW_ENTRIES_ADVENTURING,
	...RAW_ENTRIES_ADVENTURES_SETS,
	...RAW_ENTRIES_SECONDARY_CTAS,
	...RAW_ENTRIES_FIGHT_ENCOUNTERS,
	...RAW_ENTRIES_COUNTER_CTA,

	...RAW_ENTRIES_PROGRESSION_EQUIPMENT,
	...RAW_ENTRIES_PROGRESSION_ATTRIBUTES,
	...RAW_ENTRIES_MISC,

	...RAW_ENTRIES_GAME_PHASES,
	...RAW_ENTRIES_META,
	...RAW_ENTRIES_SECRETS,
	...RAW_ENTRIES_TEST,
]

const UID_CHECK: Set<string> = new Set()
const ENTRIES: Readonly<AchievementDefinition<UState>>[] = RAW_ENTRIES
	.filter(raw => raw.name && raw.description && raw.get_status)
	.map(({name, icon, description, lore, get_status, get_completion_rate}, index) => {
		if (UID_CHECK.has(name!))
			throw new Error(`Achievements: duplicate definition for "${name}"!`)
		UID_CHECK.add(name!)
		const session_uuid = [`${index}`.padStart(4, '0'), name].join(' ')
		return {
			session_uuid,
			icon: icon || '🏆',
			name: name!,
			description: description!,
			lore,
			get_status: get_status!,
			get_completion_rate,
		}
	})

export default ENTRIES
