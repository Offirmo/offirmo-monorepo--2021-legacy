import { ItemQuality, InventorySlot, ITEM_QUALITIES_TO_INT, ITEM_SLOTS } from '@oh-my-rpg/definitions'
import { appraise_value, appraise_power } from '@oh-my-rpg/logic-shop'
import { AchievementStatus, AchievementDefinition } from '@oh-my-rpg/state-progress'
import { CharacterClass, DEFAULT_AVATAR_NAME } from '@oh-my-rpg/state-character'
import { get_item_in_slot } from '@oh-my-rpg/state-inventory'
import { Weapon, matches as matches_weapon } from '@oh-my-rpg/logic-weapons'
import { Armor, matches as matches_armor } from '@oh-my-rpg/logic-armors'

import { State } from '../types'
import { STARTING_ARMOR_SPEC, STARTING_WEAPON_SPEC } from '../state/reducers/create'
//import { appraise_item_power } from '../selectors'

/*
🍪🎂🏴🏳
📦💰
🥇🥈🥉
🎖🏆🏅
👑🎓
💬
https://www.wowhead.com/the-entitled-a-guide-to-titles
https://www.wowhead.com/achievements
http://cookieclicker.wikia.com/wiki/Achievement
https://www.trueachievements.com/game/Diablo-III-Reaper-of-Souls-Ultimate-Evil-Edition/achievements
 */
// https://www.begeek.fr/vous-galerez-sur-red-dead-redemption-ii-voici-les-codes-pour-tricher-298991
// https://www.trueachievements.com/game/Diablo-III-Reaper-of-Souls-Ultimate-Evil-Edition/achievements

function _are_all_slots_equipped_with_quality_higher_or_equal_than(state: State, quality: ItemQuality): boolean {
	return ITEM_SLOTS.every(
		slot => {
			const item = get_item_in_slot(state.inventory, slot)
			return item ? ITEM_QUALITIES_TO_INT[item.quality] <= ITEM_QUALITIES_TO_INT[quality] : false
		}
	)
}
function _get_combined_equipped_items_power(state: State): number {
	return ITEM_SLOTS.reduce(
		(acc, slot) => {
			const item = get_item_in_slot(state.inventory, slot)
			return acc + (item ? appraise_power(item) : 0)
		},
		0
	)
}
function _equipped_armor_matches(state: Readonly<State>, spec: Readonly<Partial<Armor>>): boolean {
	const armor = state.inventory.slotted[InventorySlot.armor]
	return armor
		? matches_armor(armor, spec)
		: false
}
function _equipped_weapon_matches(state: Readonly<State>, spec: Readonly<Partial<Weapon>>): boolean {
	const weapon = state.inventory.slotted[InventorySlot.weapon]
	return weapon
		? matches_weapon(weapon, spec)
		: false
}

const RAW_ENTRIES_TEST: Readonly<Partial<AchievementDefinition<State>>>[] = [
	{
		icon: '🍪',
		name: 'TEST',
		description: `This secret achievement can only be obtained through debug commands, to test the achievements system.',
		lore: '…and a piece of lore should appear here`,
		get_status: (state: State) => state.progress.achievements['TEST'] === undefined || state.progress.achievements['TEST'] === AchievementStatus.secret
			? AchievementStatus.secret // keep it secret
			: AchievementStatus.unlocked, // unlock it ASAP
	},
	{
		icon: '🧒',
		name: 'Reborn!',
		description: `This secret achievement can only be obtained if you got "reborn" = your savegame was reinitialised with an autoplay due to a new format being introduced. This can only happen during the alpha.`,
		lore: 'I won’t waste this new chance! I’ll live my life to the fullest!',
		get_status: (state: State) => state.progress.achievements['Reborn!'] === AchievementStatus.unlocked
			? AchievementStatus.unlocked // keep it unlocked
			: AchievementStatus.secret, // keep it secret
	},
]

const RAW_ENTRIES_GAME_PHASES: Readonly<Partial<AchievementDefinition<State>>>[] = [
	{
		icon: '🐺',
		name: 'Alpha player',
		description: `You started playing during the alpha or earlier.`,
		lore: 'Let me tell you of a time of great adventure…',
		get_status: () => AchievementStatus.unlocked, // TODO alpha
	},
	{
		icon: '🦍',
		name: 'Beta player',
		description: `You played during the beta. (no beta yet, though)`,
		lore: 'Those were the days my friend…',
		get_status: () => AchievementStatus.revealed, // TODO beta
	},
]

const ADVENTURING: Readonly<Partial<AchievementDefinition<State>>>[] = [
	{
		icon: '🥉',
		name: 'I am bored',
		description: `Having played for the first time.`,
		get_status: (state: State) => state.progress.statistics.good_play_count
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
	},
]

// TODO adventuring
/*
exploration

Adventures
- having found the 4 rare gems
- having met X NPC
- having looted X items
- having had  enhancements applied
- - having had X different adventures
-  - having won X random encounters
- First Attempt In Learning - having lost X random encounters
- live another day - having fled X random encounters


		name: 'Happy Looter',
		name: 'Grand Looter',
		🔹🔷💠	large blue diamond	blue | diamond | geometric | large blue diamond
1369	🔸🔶
🥀

🌱
553	U+1F332	🌲	evergreen tree	evergreen tree | tree
554	U+1F333	🌳	deciduous tree	deciduous | shedding | tree
555	U+1F334	🌴	palm tree	palm | tree
556	U+1F335	🌵	cactus	cactus | plant
557	U+1F33E	🌾	sheaf of rice	ear | grain | rice | sheaf of rice
558	U+1F33F	🌿	herb	herb | leaf
559	U+2618	☘	shamrock	plant | shamrock
560	U+1F340	🍀	four leaf clover	4 | clover | four | four-leaf clover | leaf
561	U+1F341	🍁	maple leaf	falling | leaf | maple
562	U+1F342	🍂	fallen leaf	fallen leaf | falling | leaf
563	U+1F343	🍃	leaf fluttering in wind	blow | flutter | leaf | leaf fluttering in wind | wind

🏔	snow-capped mountain	cold | mountain | snow | snow-capped mountain
684	U+26F0	⛰	mountain	mountain
685	U+1F30B	🌋	volcano	eruption | mountain | volcano
686	U+1F5FB	🗻	mount fuji	fuji | mount fuji | mountain
687	U+1F3D5	🏕	camping	camping
688	U+1F3D6	🏖	beach with umbrella	beach | beach with umbrella | umbrella
689	U+1F3DC	🏜	desert	desert
690	U+1F3DD	🏝	desert island	desert | island
691	U+1F3DE	🏞
723	U+1F301	🌁	foggy	fog | foggy
724	U+1F303	🌃	night with stars	night | night with stars | star
725	U+1F3D9	🏙	cityscape	city | cityscape
726	U+1F304	🌄	sunrise over mountains	morning | mountain | sun | sunrise | sunrise over mountains
727	U+1F305	🌅	sunrise	morning | sun | sunrise
728	U+1F306	🌆	cityscape at dusk	city | cityscape at dusk | dusk | evening | landscape | sunset
729	U+1F307	🌇	sunset	dusk | sun | sunset
730	U+1F309	🌉	bridge at night	bridge | bridge at night | night
731	U+2668	♨	hot springs	hot | hotsprings | springs | steaming
732	U+1F30C	🌌	milky way
782	U+2693	⚓	anchor	anchor | ship | tool
783	U+26F5	⛵	sailboat	boat | resort | sailboat | sea | yacht
784	U+1F6F6	🛶	canoe
882	U+1F386	🎆	fireworks	celebration | fireworks
883	U+1F387	🎇	sparkler
 */


const GOOD_CLICKS_TIERS = [1, 7, 11, 77, 500, 1000, 10_000]
const RAW_ENTRIES_PRIMARY_CTA: Readonly<Partial<AchievementDefinition<State>>>[] = [
	{
		icon: '🥉',
		name: 'I am bored',
		description: `Having played for the first time.`,
		lore: 'I am looking for someone to share in an adventure…',
		get_status: (state: State) => state.progress.statistics.good_play_count
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
	},
	{
		icon: '🥈',
		name: 'I am very bored',
		description: `Having played ${GOOD_CLICKS_TIERS[1]} times.`,
		lore: 'If I take one more step, I’ll be the farthest away from home I’ve ever been…',
		get_status: (state: State) => state.progress.statistics.good_play_count >= GOOD_CLICKS_TIERS[1]
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
		get_completion_rate: (state: State) => ([state.progress.statistics.good_play_count, GOOD_CLICKS_TIERS[1]])
	},
	{
		icon: '🥇',
		// https://www.urbandictionary.com/define.php?term=Turn%20it%20up%20to%20eleven
		name: 'Turn it up to eleven',
		description: `Having played 11 times.`,
		lore: 'You step onto the road, and there’s no telling where you might be swept off to…',
		get_status: (state: State) => state.progress.statistics.good_play_count >= GOOD_CLICKS_TIERS[2]
			? AchievementStatus.unlocked
			: state.progress.statistics.good_play_count >= GOOD_CLICKS_TIERS[1]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.progress.statistics.good_play_count, GOOD_CLICKS_TIERS[2]])
	},
	{
		icon: '🏅',
		name: 'I am dead bored',
		description: `Having played ${GOOD_CLICKS_TIERS[3]} times.`,
		lore: 'Not all those who wander are lost.',
		get_status: (state: State) => state.progress.statistics.good_play_count >= GOOD_CLICKS_TIERS[3]
			? AchievementStatus.unlocked
			: state.progress.statistics.good_play_count >= GOOD_CLICKS_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.progress.statistics.good_play_count, GOOD_CLICKS_TIERS[3]])
	},
	{
		icon: '🎖',
		name: 'did I mention I was bored?',
		description: `Having played ${GOOD_CLICKS_TIERS[4]} times.`,
		// lore: 'TODO',
		get_status: (state: State) => state.progress.statistics.good_play_count >= GOOD_CLICKS_TIERS[4]
			? AchievementStatus.unlocked
			: state.progress.statistics.good_play_count >= GOOD_CLICKS_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.progress.statistics.good_play_count, GOOD_CLICKS_TIERS[4]])
	},
	{
		icon: '👑',
		name: 'king of boredom',
		description: `Having played ${GOOD_CLICKS_TIERS[5]} times.`,
		// lore: 'TODO',
		get_status: (state: State) => state.progress.statistics.good_play_count >= GOOD_CLICKS_TIERS[5]
			? AchievementStatus.unlocked
			: state.progress.statistics.good_play_count >= GOOD_CLICKS_TIERS[4]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.progress.statistics.good_play_count, GOOD_CLICKS_TIERS[5]])
	},
	{
		icon: '🏆',
		name: 'No-life except for boredom',
		description: `Having played ${GOOD_CLICKS_TIERS[6]} times.`,
		// lore: 'TODO',
		get_status: (state: State) => state.progress.statistics.good_play_count >= GOOD_CLICKS_TIERS[6]
			? AchievementStatus.unlocked
			: state.progress.statistics.good_play_count >= GOOD_CLICKS_TIERS[5]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.progress.statistics.good_play_count, GOOD_CLICKS_TIERS[6]])
	},
]

const BAD_CLICKS_TIERS = [0, 1, 2, 10, 50, 500]
const RAW_ENTRIES_COUNTER_CTA: Readonly<Partial<AchievementDefinition<State>>>[] = [
	// = bad clicks
	{
		icon: '😱',
		name: 'Sorry my hand slipped',
		description: `Having played too soon for the 1st time.`,
		lore: 'each mistake teaches us something…',
		get_status: (state: State) => state.progress.statistics.bad_play_count
			? AchievementStatus.unlocked
			: AchievementStatus.hidden,
	},
	{
		icon: '🙀',
		name: 'Oops!... I Did It Again',
		description: `Having played too soon for the 2nd time.`,
		lore: 'Anyone who has never made a mistake has never tried anything new.',
		get_status: (state: State) => state.progress.statistics.bad_play_count >= BAD_CLICKS_TIERS[2]
			? AchievementStatus.unlocked
			: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.progress.statistics.bad_play_count, BAD_CLICKS_TIERS[2]])
	},
	{
		icon: '😼',
		name: 'I’m not that innocent',
		description: `Having played too soon 10 times.`,
		lore: 'There is no such thing as accident; it is fate misnamed.',
		get_status: (state: State) => state.progress.statistics.bad_play_count >= BAD_CLICKS_TIERS[3]
			? AchievementStatus.unlocked
			: state.progress.statistics.bad_play_count >= BAD_CLICKS_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.progress.statistics.bad_play_count, BAD_CLICKS_TIERS[2]])
	},
	{
		icon: '😈',
		name: 'It’s good to be bad',
		description: `Having played too soon 66 times.`,
		lore: 'Never retreat, never retract… never admit a mistake…',
		get_status: (state: State) => state.progress.statistics.bad_play_count >= BAD_CLICKS_TIERS[4]
			? AchievementStatus.unlocked
			: state.progress.statistics.bad_play_count >= BAD_CLICKS_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.progress.statistics.bad_play_count, BAD_CLICKS_TIERS[3]])
	},
	{
		icon: '👻',
		name: 'Hello darkness my old friend',
		description: `Having played too soon 666 times.`,
		lore: 'Give yourself to the dark side…',
		get_status: (state: State) => state.progress.statistics.bad_play_count >= BAD_CLICKS_TIERS[5]
			? AchievementStatus.unlocked
			: state.progress.statistics.bad_play_count >= BAD_CLICKS_TIERS[4]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.progress.statistics.bad_play_count, BAD_CLICKS_TIERS[4]])
	},
]

const REGULARITY_TIERS = [1, 2, 3, 7, 30, 120, 365]
const RAW_ENTRIES_SECONDARY_CTAS: Readonly<Partial<AchievementDefinition<State>>>[] = [
	// regularity
	{
		icon: '🌱',
		name: 'I’ll Be Back',
		description: `Having been playing for ${REGULARITY_TIERS[1]} days.`,
		// lore: 'TODO',
		get_status: (state: State) => state.progress.statistics.active_day_count >= REGULARITY_TIERS[1]
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
	},
	{
		icon: '🌿',
		name: 'I Am Back',
		description: `Having been playing for ${REGULARITY_TIERS[2]} days.`,
		// lore: 'TODO',
		get_status: (state: State) => state.progress.statistics.active_day_count >= REGULARITY_TIERS[2]
			? AchievementStatus.unlocked
			: state.progress.statistics.active_day_count >= REGULARITY_TIERS[1]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.progress.statistics.active_day_count, REGULARITY_TIERS[2]])
	},
	{
		icon: '🌲',
		name: 'Regular',
		description: `Having been playing for ${REGULARITY_TIERS[3]} days.`,
		// lore: 'TODO',
		get_status: (state: State) => state.progress.statistics.active_day_count >= REGULARITY_TIERS[3]
			? AchievementStatus.unlocked
			: state.progress.statistics.active_day_count >= REGULARITY_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.progress.statistics.active_day_count, REGULARITY_TIERS[3]])
	},
	{
		icon: '🌳',
		name: 'Faithful',
		description: `Having been playing for ${REGULARITY_TIERS[4]} days.`,
		// lore: 'TODO',
		get_status: (state: State) => state.progress.statistics.active_day_count >= REGULARITY_TIERS[4]
			? AchievementStatus.unlocked
			: state.progress.statistics.active_day_count >= REGULARITY_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.progress.statistics.active_day_count, REGULARITY_TIERS[4]])
	},
	{
		icon: '💉',
		name: 'Hooked',
		description: `Having been playing for ${REGULARITY_TIERS[5]} days.`,
		// lore: 'TODO',
		get_status: (state: State) => state.progress.statistics.active_day_count >= REGULARITY_TIERS[5]
			? AchievementStatus.unlocked
			: state.progress.statistics.active_day_count >= REGULARITY_TIERS[4]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.progress.statistics.active_day_count, REGULARITY_TIERS[5]])
	},
	{
		icon: '🎂',
		name: 'Addicted',
		description: `Having been playing for ${REGULARITY_TIERS[6]} days.`,
		// lore: 'TODO',
		get_status: (state: State) => state.progress.statistics.active_day_count >= REGULARITY_TIERS[6]
			? AchievementStatus.unlocked
			: state.progress.statistics.active_day_count >= REGULARITY_TIERS[5]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.progress.statistics.active_day_count, REGULARITY_TIERS[6]])
	},
]

const RAW_ENTRIES_ENGAGEMENT: Readonly<Partial<AchievementDefinition<State>>>[] = [
	{
		icon: '🎫',
		name: 'What’s in a name?',
		description: `Having set one’s name.`,
		// lore: 'TODO',
		get_status: (state: State) => state.avatar.name !== DEFAULT_AVATAR_NAME
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
	},
	{
		icon: '🎓',
		name: 'Graduated',
		description: `Having selected a class.`,
		// lore: 'TODO',
		get_status: (state: State) => state.avatar.klass !== CharacterClass.novice
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
	},
	{
		icon: '🆔',
		name: 'Registered',
		description: `Having signed up.`,
		// lore: 'TODO',
		// TODO make that unlock new adventures
	},
]

const POWER_TIERS = [0, 1000, 5000, 10_000, 50_000, 100_000]
const RAW_ENTRIES_PROGRESSION_EQUIPMENT: Readonly<Partial<AchievementDefinition<State>>>[] = [
	{
		icon: '🥄',
		name: 'There Is No Spoon',
		description: `Having replaced your starting "spoon of the noob" weapon.`,
		lore: 'A weapon isn’t good or bad, depends on the person who uses it.',
		get_status: (state: State) => (!state.inventory.slotted[InventorySlot.weapon] || _equipped_weapon_matches(state, STARTING_WEAPON_SPEC))
			? AchievementStatus.revealed
			: AchievementStatus.unlocked,
	},
	{
		icon: '🧦',
		name: 'They Weren’t Matched Anyway',
		description: `Having replaced your starting "socks of the noob" armor.`,
		lore: 'I’ll tell you one thing you can’t do: you can’t put your shoes on, then your socks on.',
		get_status: (state: State) => (!state.inventory.slotted[InventorySlot.armor] || _equipped_armor_matches(state, STARTING_ARMOR_SPEC))
			? AchievementStatus.revealed
			: AchievementStatus.unlocked,
	},
	{
		icon: '🎒',
		name: 'I Was Born Ready',
		description: `Having replaced all your starting "spoon+socks" equipment.`,
		// lore: 'TODO',
		get_status: (state: State) => _equipped_armor_matches(state, STARTING_ARMOR_SPEC) || _equipped_weapon_matches(state, STARTING_WEAPON_SPEC)
			? AchievementStatus.revealed
			: AchievementStatus.unlocked,
	},

	// - quality
	{
		icon: '🛍',
		name: 'U Got The Look',
		description: `All equipped items of quality uncommon or higher. 💚 `,
		lore: 'If there are cracks in your armor, your opponent is going to find them...',
		get_status: (state: State) => _are_all_slots_equipped_with_quality_higher_or_equal_than(state, ItemQuality.uncommon)
				? AchievementStatus.unlocked
				: AchievementStatus.revealed,
	},
	{
		icon: '💅',
		name: 'Rare Sight',
		description: `All equipped items of quality rare or higher. 💙 `,
		// lore: 'TODO',
		get_status: (state: State) => _are_all_slots_equipped_with_quality_higher_or_equal_than(state, ItemQuality.rare)
			? AchievementStatus.unlocked
			: _are_all_slots_equipped_with_quality_higher_or_equal_than(state, ItemQuality.uncommon)
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
	},
	{
		icon: '🎩',
		name: 'Epic Smile',
		description: `All equipped items of quality epic or higher. 💜 `,
		// lore: 'TODO',
		get_status: (state: State) => _are_all_slots_equipped_with_quality_higher_or_equal_than(state, ItemQuality.epic)
			? AchievementStatus.unlocked
			: _are_all_slots_equipped_with_quality_higher_or_equal_than(state, ItemQuality.rare)
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
	},
	{
		icon: '👑',
		name: 'I Am A Legend',
		description: `All equipped items of quality legendary or higher. 🧡 `,
		// lore: 'TODO',
		get_status: (state: State) => _are_all_slots_equipped_with_quality_higher_or_equal_than(state, ItemQuality.legendary)
			? AchievementStatus.unlocked
			: _are_all_slots_equipped_with_quality_higher_or_equal_than(state, ItemQuality.epic)
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
	},
	{
		icon: '🌞',
		name: 'Twinkle Twinkle Little Star',
		description: `All equipped items of quality artifact or higher. 💛 `,
		// lore: 'TODO',
		get_status: (state: State) => _are_all_slots_equipped_with_quality_higher_or_equal_than(state, ItemQuality.artifact)
			? AchievementStatus.unlocked
			: AchievementStatus.hidden, // since artifact can't be obtained by normal means
	},

	// - power
	{
		icon: '🐸',
		name: 'Frog In A Well',
		description: `Having a combined equipment’s power of ${POWER_TIERS[1]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => _get_combined_equipped_items_power(state) > POWER_TIERS[1]
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
		get_completion_rate: (state: State) => ([_get_combined_equipped_items_power(state), POWER_TIERS[1]])
	},
	{
		icon: '👙',
		name: 'Looking Like something',
		description: `Having a combined equipment’s power of ${POWER_TIERS[2]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => _get_combined_equipped_items_power(state) > POWER_TIERS[2]
			? AchievementStatus.unlocked
			: _get_combined_equipped_items_power(state) > POWER_TIERS[1]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([_get_combined_equipped_items_power(state), POWER_TIERS[2]])
	},
	{
		icon: '🎁',
		name: 'Formal Adventurer',
		description: `Having a combined equipment’s power of ${POWER_TIERS[3]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => _get_combined_equipped_items_power(state) > POWER_TIERS[3]
			? AchievementStatus.unlocked
			: _get_combined_equipped_items_power(state) > POWER_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([_get_combined_equipped_items_power(state), POWER_TIERS[3]])
	},
	{
		icon: '🔱',
		name: 'King-looking Adventurer',
		description: `Having a combined equipment’s power of ${POWER_TIERS[4]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => _get_combined_equipped_items_power(state) > POWER_TIERS[4]
			? AchievementStatus.unlocked
			: _get_combined_equipped_items_power(state) > POWER_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([_get_combined_equipped_items_power(state), POWER_TIERS[4]])
	},
	{
		icon: '⚜',
		name: 'Emperor-Looking Adventurer',
		description: `Having a combined equipment’s power of ${POWER_TIERS[5]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => _get_combined_equipped_items_power(state) > POWER_TIERS[5]
			? AchievementStatus.unlocked
			: _get_combined_equipped_items_power(state) > POWER_TIERS[4]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([_get_combined_equipped_items_power(state), POWER_TIERS[5]])
	},
]

const ATTRIBUTES_TIERS = [1, 10, 33, 66, 100]
const RAW_ENTRIES_PROGRESSION_ATTRIBUTES: Readonly<Partial<AchievementDefinition<State>>>[] = [

	/////// LEVEL ///////
	// https://en.uesp.net/wiki/Oblivion:Leveling
	{
		icon: '👶',
		name: 'Tiny Adventurer',
		description: `Having a level of 3 or higher.`,
		lore: 'You realize that all your life you have been coasting along as if you were in a dream. Suddenly, facing the trials of the last few days, you have come alive.',
		get_status: (state: State) => state.avatar.attributes.level >= 3
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
		get_completion_rate: (state: State) => ([state.avatar.attributes.level, 3])
	},
	{
		icon: '🧒',
		name: 'Reasonable Adventurer',
		description: `Having a level of 7 or higher.`,
		lore: 'Today you wake up, full of energy and ideas, and you know, somehow, that overnight everything has changed. What a difference a day makes.',
		get_status: (state: State) => state.avatar.attributes.level >= 7
			? AchievementStatus.unlocked
			: state.avatar.attributes.level >= 3
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.level, 7])
	},
	{
		icon: '👩‍🎤',
		name: 'Teenage Adventurer',
		description: `Having a level of 12 or higher.`,
		lore: 'You’ve done things the hard way. But without taking risks, taking responsibility for failure... how could you have understood?',
		get_status: (state: State) => state.avatar.attributes.level >= 12
			? AchievementStatus.unlocked
			: state.avatar.attributes.level >= 7
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.level, 12])
	},
	{
		icon: '🧑',
		name: 'Newbie Adventurer',
		description: `Having a level of 20 or higher.`,
		lore: 'Being smart doesn’t hurt. And a little luck now and then is nice. But the key is patience and hard work.',
		get_status: (state: State) => state.avatar.attributes.level >= 20
			? AchievementStatus.unlocked
			: state.avatar.attributes.level >= 12
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.level, 20])
	},
	{
		icon: '🧑',
		name: 'Seasoned Adventurer',
		description: `Having a level of ${ATTRIBUTES_TIERS[2]} or higher.`,
		lore: 'You resolve to continue pushing yourself. Perhaps there’s more to you than you thought.',
		get_status: (state: State) => state.avatar.attributes.level >= ATTRIBUTES_TIERS[2]
			? AchievementStatus.unlocked
			: state.avatar.attributes.level >= 20
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.level, ATTRIBUTES_TIERS[2]])
	},
	{
		icon: '🧓',
		name: 'Grey Haired Adventurer',
		description: `Having a level of ${ATTRIBUTES_TIERS[3]} or higher.`,
		lore: 'With the life you’ve been living, the punishment your body has taken... there are limits, and maybe you’ve reached them. Is this what it’s like to grow old?',
		get_status: (state: State) => state.avatar.attributes.level >= ATTRIBUTES_TIERS[3]
			? AchievementStatus.unlocked
			: state.avatar.attributes.level >= ATTRIBUTES_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.level, ATTRIBUTES_TIERS[3]])
	},
	{
		icon: '🐢',
		name: 'Spirit Of The Tortoise',
		description: `Having a level of ${ATTRIBUTES_TIERS[4]} or higher.`,
		lore: 'So that’s how it works. You plod along, putting one foot before the other, look up, and suddenly, there you are. Right where you wanted to be all along.',
		get_status: (state: State) => state.avatar.attributes.level >= ATTRIBUTES_TIERS[4]
			? AchievementStatus.unlocked
			: state.avatar.attributes.level >= ATTRIBUTES_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.level, ATTRIBUTES_TIERS[4]])
	},
	{
		icon: '🧝',
		name: 'Long Lived Adventurer',
		description: `Having a level of 300 or higher.`,
		lore: 'The results of hard work and dedication always look like luck. But you know you’ve earned every ounce of your success.',
		get_status: (state: State) => state.avatar.attributes.level >= 300
			? AchievementStatus.unlocked
			: state.avatar.attributes.level >= ATTRIBUTES_TIERS[4]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.level, 300])
	},


	/////// health ///////
	// elephant
	{
		icon: '💪',
		name: 'Light Punishment',
		description: `Having a health of ${ATTRIBUTES_TIERS[1]} or higher.`,
		lore: 'That’s just a scratch...',
		get_status: (state: State) => state.avatar.attributes.health >= ATTRIBUTES_TIERS[1]
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
		get_completion_rate: (state: State) => ([state.avatar.attributes.health, ATTRIBUTES_TIERS[1]])
	},
	{
		icon: '😤',
		name: 'Bring It On',
		description: `Having a health of ${ATTRIBUTES_TIERS[2]} or higher.`,
		lore: 'Not even hurt!',
		get_status: (state: State) => state.avatar.attributes.health >= ATTRIBUTES_TIERS[2]
			? AchievementStatus.unlocked
			: state.avatar.attributes.health >= ATTRIBUTES_TIERS[1]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.health, ATTRIBUTES_TIERS[2]])
	},
	{
		icon: '🏋',
		name: 'I Can Handle It',
		description: `Having a health of ${ATTRIBUTES_TIERS[3]} or higher.`,
		lore: 'Is that all you’ve got?',
		get_status: (state: State) => state.avatar.attributes.health >= ATTRIBUTES_TIERS[3]
			? AchievementStatus.unlocked
			: state.avatar.attributes.health >= ATTRIBUTES_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.health, ATTRIBUTES_TIERS[3]])
	},
	{
		icon: '🐘',
		name: 'Spirit Of The Elephant',
		description: `Having a health of ${ATTRIBUTES_TIERS[4]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => state.avatar.attributes.health >= ATTRIBUTES_TIERS[4]
			? AchievementStatus.unlocked
			: state.avatar.attributes.health >= ATTRIBUTES_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.health, ATTRIBUTES_TIERS[4]])
	},

	/////// mana ///////
	{
		icon: '🍼',
		name: 'Awoken',
		description: `Having a mana of ${ATTRIBUTES_TIERS[1]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => state.avatar.attributes.mana >= ATTRIBUTES_TIERS[1]
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
		get_completion_rate: (state: State) => ([state.avatar.attributes.mana, ATTRIBUTES_TIERS[1]])
	},
	{
		icon: '🥛',
		name: 'The Power Of The Mind',
		description: `Having a mana of ${ATTRIBUTES_TIERS[2]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => state.avatar.attributes.mana >= ATTRIBUTES_TIERS[2]
			? AchievementStatus.unlocked
			: state.avatar.attributes.mana >= ATTRIBUTES_TIERS[1]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.mana, ATTRIBUTES_TIERS[2]])
	},
	{
		icon: '☕',
		name: 'Vast Consciousness',
		description: `Having a mana of ${ATTRIBUTES_TIERS[3]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => state.avatar.attributes.mana >= ATTRIBUTES_TIERS[3]
			? AchievementStatus.unlocked
			: state.avatar.attributes.mana >= ATTRIBUTES_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.mana, ATTRIBUTES_TIERS[3]])
	},
	{
		icon: '🧙',
		name: 'Spirit Of The Human',
		description: `Having a mana of ${ATTRIBUTES_TIERS[4]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => state.avatar.attributes.mana >= ATTRIBUTES_TIERS[4]
			? AchievementStatus.unlocked
			: state.avatar.attributes.mana >= ATTRIBUTES_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.mana, ATTRIBUTES_TIERS[4]])
	},

	/////// STRENGTH ///////
	{
		icon: '💪',
		name: 'Well Built',
		description: `Having a strength of ${ATTRIBUTES_TIERS[1]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => state.avatar.attributes.strength >= ATTRIBUTES_TIERS[1]
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
		get_completion_rate: (state: State) => ([state.avatar.attributes.strength, ATTRIBUTES_TIERS[1]]),
	},
	{
		icon: '😤',
		name: 'Local Strongperson',
		description: `Having a strength of ${ATTRIBUTES_TIERS[2]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => state.avatar.attributes.strength >= ATTRIBUTES_TIERS[2]
			? AchievementStatus.unlocked
			: state.avatar.attributes.strength >= ATTRIBUTES_TIERS[1]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.strength, ATTRIBUTES_TIERS[2]]),
	},
	{
		icon: '🏋',
		name: 'Titan',
		description: `Having a strength of ${ATTRIBUTES_TIERS[3]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => state.avatar.attributes.strength >= ATTRIBUTES_TIERS[3]
			? AchievementStatus.unlocked
			: state.avatar.attributes.strength >= ATTRIBUTES_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.strength, ATTRIBUTES_TIERS[3]]),
	},
	{
		icon: '🦍',
		name: 'Spirit Of The Gorilla',
		description: `Having a strength of ${ATTRIBUTES_TIERS[4]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => state.avatar.attributes.strength >= ATTRIBUTES_TIERS[4]
			? AchievementStatus.unlocked
			: state.avatar.attributes.strength >= ATTRIBUTES_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.strength, ATTRIBUTES_TIERS[4]]),
	},

	/////// AGILITY ///////
	{
		icon: '🐥',
		name: 'Small One',
		description: `Having a agility of ${ATTRIBUTES_TIERS[1]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => state.avatar.attributes.agility >= ATTRIBUTES_TIERS[1]
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
		get_completion_rate: (state: State) => ([state.avatar.attributes.agility, ATTRIBUTES_TIERS[1]]),
	},
	{
		icon: '🤹',
		name: 'Swift One',
		description: `Having a agility of ${ATTRIBUTES_TIERS[2]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => state.avatar.attributes.agility >= ATTRIBUTES_TIERS[2]
			? AchievementStatus.unlocked
			: state.avatar.attributes.agility >= ATTRIBUTES_TIERS[1]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.agility, ATTRIBUTES_TIERS[2]]),
	},
	{
		icon: '🤸',
		name: 'Untouchable',
		description: `Having a agility of ${ATTRIBUTES_TIERS[3]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => state.avatar.attributes.agility >= ATTRIBUTES_TIERS[3]
			? AchievementStatus.unlocked
			: state.avatar.attributes.agility >= ATTRIBUTES_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.agility, ATTRIBUTES_TIERS[3]]),
	},
	{
		icon: '🐒',
		name: 'Spirit Of The Monkey',
		description: `Having a agility of ${ATTRIBUTES_TIERS[4]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => state.avatar.attributes.agility >= ATTRIBUTES_TIERS[4]
			? AchievementStatus.unlocked
			: state.avatar.attributes.agility >= ATTRIBUTES_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.agility, ATTRIBUTES_TIERS[4]]),
	},

	/////// CHARISMA ///////
	// https://www.google.com/search?q=silver+tongue
	{
		icon: '💖',
		name: 'Sharp tongue',
		description: `Having a charisma of ${ATTRIBUTES_TIERS[1]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => state.avatar.attributes.charisma >= ATTRIBUTES_TIERS[1]
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
		get_completion_rate: (state: State) => ([state.avatar.attributes.charisma, ATTRIBUTES_TIERS[1]]),
	},
	{
		icon: '💓',
		name: 'Silver tongue',
		description: `Having a charisma of ${ATTRIBUTES_TIERS[2]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => state.avatar.attributes.charisma >= ATTRIBUTES_TIERS[2]
			? AchievementStatus.unlocked
			: state.avatar.attributes.charisma >= ATTRIBUTES_TIERS[1]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.charisma, ATTRIBUTES_TIERS[2]]),
	},
	{
		icon: '💋',
		name: 'Golden tongue',
		description: `Having a charisma of ${ATTRIBUTES_TIERS[3]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => state.avatar.attributes.charisma >= ATTRIBUTES_TIERS[3]
			? AchievementStatus.unlocked
			: state.avatar.attributes.charisma >= ATTRIBUTES_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.charisma, ATTRIBUTES_TIERS[3]]),
	},
	{
		icon: '🐈',
		name: 'Spirit Of The Cat', // panda?
		description: `Having a charisma of ${ATTRIBUTES_TIERS[4]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => state.avatar.attributes.charisma >= ATTRIBUTES_TIERS[4]
			? AchievementStatus.unlocked
			: state.avatar.attributes.charisma >= ATTRIBUTES_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.charisma, ATTRIBUTES_TIERS[4]]),
	},

	/////// WISDOM ///////
	//
	{
		icon: '🤓',
		name: 'Bright',
		description: `Having a wisdom of ${ATTRIBUTES_TIERS[1]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => state.avatar.attributes.wisdom >= ATTRIBUTES_TIERS[1]
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
		get_completion_rate: (state: State) => ([state.avatar.attributes.wisdom, ATTRIBUTES_TIERS[1]]),
	},
	{
		icon: '🧐',
		name: 'Smart',
		description: `Having a wisdom of ${ATTRIBUTES_TIERS[2]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => state.avatar.attributes.wisdom >= ATTRIBUTES_TIERS[2]
			? AchievementStatus.unlocked
			: state.avatar.attributes.wisdom >= ATTRIBUTES_TIERS[1]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.wisdom, ATTRIBUTES_TIERS[2]]),
	},
	{
		icon: '🧓',
		name: 'Sage',
		description: `Having a wisdom of ${ATTRIBUTES_TIERS[3]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => state.avatar.attributes.wisdom >= ATTRIBUTES_TIERS[3]
			? AchievementStatus.unlocked
			: state.avatar.attributes.wisdom >= ATTRIBUTES_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.wisdom, ATTRIBUTES_TIERS[3]]),
	},
	{
		icon: '🦉',
		name: 'Spirit Of The Owl',
		description: `Having a wisdom of ${ATTRIBUTES_TIERS[4]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => state.avatar.attributes.wisdom >= ATTRIBUTES_TIERS[4]
			? AchievementStatus.unlocked
			: state.avatar.attributes.wisdom >= ATTRIBUTES_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.wisdom, ATTRIBUTES_TIERS[4]]),
	},

	/////// LUCK ///////
	// rabbit
	{
		icon: '☘',
		name: 'Sprinkled',
		description: `Having a luck of ${ATTRIBUTES_TIERS[1]} or higher.`,
		lore: 'Luck is great, but most of life is hard work.',
		get_status: (state: State) => state.avatar.attributes.luck >= ATTRIBUTES_TIERS[1]
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
		get_completion_rate: (state: State) => ([state.avatar.attributes.luck, ATTRIBUTES_TIERS[1]]),
	},
	{
		icon: '🍀',
		name: 'Blessed',
		description: `Having a luck of ${ATTRIBUTES_TIERS[2]} or higher.`,
		lore: 'The amount of good luck coming your way depends on your willingness to act.',
		get_status: (state: State) => state.avatar.attributes.luck >= ATTRIBUTES_TIERS[2]
			? AchievementStatus.unlocked
			: state.avatar.attributes.luck >= ATTRIBUTES_TIERS[1]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.luck, ATTRIBUTES_TIERS[2]]),
	},
	{
		icon: '👼',
		name: 'Divinely Touched',
		description: `Having a luck of ${ATTRIBUTES_TIERS[3]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => state.avatar.attributes.luck >= ATTRIBUTES_TIERS[3]
			? AchievementStatus.unlocked
			: state.avatar.attributes.luck >= ATTRIBUTES_TIERS[2]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.luck, ATTRIBUTES_TIERS[3]]),
	},
	{
		icon: '🐇',
		name: 'Spirit Of The Rabbit',
		description: `Having a luck of ${ATTRIBUTES_TIERS[4]} or higher.`,
		// lore: 'TODO',
		get_status: (state: State) => state.avatar.attributes.luck >= ATTRIBUTES_TIERS[4]
			? AchievementStatus.unlocked
			: state.avatar.attributes.luck >= ATTRIBUTES_TIERS[3]
				? AchievementStatus.revealed
				: AchievementStatus.hidden,
		get_completion_rate: (state: State) => ([state.avatar.attributes.luck, ATTRIBUTES_TIERS[4]]),
	},
]

const RAW_ENTRIES_MISC: Readonly<Partial<AchievementDefinition<State>>>[] = [
	{
		icon: '⚔',
		name: 'I Like Swords!',
		description: `Having equipped a sword once.`,
		lore: 'Still sharp...',
		get_status: (state: State) => _equipped_weapon_matches(state, { base_hid: 'sword'}) || _equipped_weapon_matches(state, { base_hid: 'longsword'})
			? AchievementStatus.unlocked
			: AchievementStatus.revealed,
	},
]
/*’

Classes
- - having played X times as a X

Social / virality
-

Misc
- here you go - (see cookie clicker)

Titles
- class related (see WoW)
- visitor -
- explorer -
- X, dragonslayer- having won a random encounter with a dragon
- X from another world
- X the bored
- PvP

https://www.imdb.com/title/tt0120737/quotes?ref_=tt_ql_trv_4
https://www.imdb.com/title/tt0167261/quotes?ref_=tt_ql_trv_4
https://www.imdb.com/title/tt0167260/quotes?ref_=tt_ql_trv_4

The red pill
The blue pill
Free your mind
You are the One
What is best in life?
the enigma of steel
the jeweled crown of Aquilonia
You cannot pass!
A wizard is never late
One does not simply walk into Mordor
You have my sword...
Legolas: And you have my bow.
Gimli: And *my* axe.
they are coming
Such a little thing

you've been officially labeled a 'disturber of the peace.'

https://en.wikipedia.org/wiki/All_that_is_gold_does_not_glitter

https://www.brainyquote.com/search_results?q=adventure
 */

const RAW_ENTRIES_SECRETS: Readonly<Partial<AchievementDefinition<State>>>[] = [
	{
		icon: '👑',
		name: 'Usurper',
		description: `Having set the name "Offirmo".`,
		lore: 'I see you…',
		get_status: (state: State) => state.avatar.name === 'Offirmo'
			? AchievementStatus.unlocked
			: AchievementStatus.secret,
	},
	{
		icon: '💣',
		name: 'Blown Away',
		description: `Having encountered a crash...`,
		//lore: 'TODO',
		// TODO
	},
	{
		icon: '🍀',
		name: 'Just plain lucky',
		description: `You have 1/1000 chance to gain this on each activity.`,
		lore: 'The amount of good luck coming your way depends on your willingness to act.',
		get_status: () => Math.floor(Math.random() * 1000) === 123
			? AchievementStatus.unlocked
			: AchievementStatus.secret,
	},
	{
		icon: '🏴‍☠️',
		name: 'Hacker',
		description: `You manipulated the threads of reality to obtain this achievement. (can’t be obtained by normal means)`,
		lore: 'Just a different way of looking at problems that no one’s thought of ;)',
		get_status: (state: State) => AchievementStatus.secret,
	},
]

const RAW_ENTRIES: Readonly<Partial<AchievementDefinition<State>>>[] = [

	// Intro
	{
		icon: '✨',
		name: 'Summoned',
		description: `You began your adventures in another world.`,
		lore: 'Thanks for visiting!',
		get_status: () => AchievementStatus.unlocked,
	},

	...RAW_ENTRIES_PRIMARY_CTA,
	...RAW_ENTRIES_COUNTER_CTA,
	...RAW_ENTRIES_SECONDARY_CTAS,
	...RAW_ENTRIES_ENGAGEMENT,

	...RAW_ENTRIES_PROGRESSION_EQUIPMENT,
	...RAW_ENTRIES_PROGRESSION_ATTRIBUTES,
	...RAW_ENTRIES_MISC,

	...RAW_ENTRIES_GAME_PHASES,
	...RAW_ENTRIES_SECRETS,
	...RAW_ENTRIES_TEST,
]

const ENTRIES: Readonly<AchievementDefinition<State>>[] = RAW_ENTRIES
	.filter(raw => raw.name && raw.description && raw.get_status)
	.map(({name, icon, description, lore, get_status, get_completion_rate}, index) => {
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
