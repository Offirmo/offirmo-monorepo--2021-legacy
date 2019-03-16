import { Enum } from 'typescript-string-enums'

import { BaseUState } from '@offirmo-private/state'

/////////////////////

const CharacterAttribute = Enum(
	// TODO improve
	'agility',
	'health',
	'level',
	'luck',
	'mana',
	'strength',
	'charisma',
	'wisdom',
)
type CharacterAttribute = Enum<typeof CharacterAttribute> // eslint-disable-line no-redeclare

// I arbitrarily skip the classes I find uncool / unclear / better fit for a "job"
const CharacterClass = Enum(
	// initial (also Korean game)
	'novice',

	// classic DnD
	// https://www.dndbeyond.com/characters/classes
	'barbarian',
	//'bard',
	//'cleric',
	'druid',
	'warrior', // fighter is too generic for my taste
	// monk is unclear IMO
	'paladin',
	//'ranger',
	'rogue',
	'sorcerer',
	'warlock',
	'wizard',
	'darkness hunter', // better than blood

	// additionals from WoW
	// https://worldofwarcraft.com/en-us/game/classes
	'hunter',
	'priest',
	//'shaman',
	'death knight',
	'mage',

	// additionals, from GW2
	// https://www.guildwars2.com/en/the-game/professions/
	'engineer',
	'thief',

	// extra unofficial DnD
	// https://en.wikipedia.org/wiki/Character_class_(Dungeons_%26_Dragons)
	'assassin',
	'illusionist',
	//'witch',
	//'witch doctor',

	// extras, sometime from pop culture
	'knight',
	'pirate',
	'ninja',
	//'spy',
	'corsair',
	'necromancer',

	// mangas
	'sculptor',
	'summoner',

)
type CharacterClass = Enum<typeof CharacterClass> // eslint-disable-line no-redeclare

/////////////////////

interface CharacterAttributes {
	[CharacterAttribute.level]: number

	[CharacterAttribute.health]: number
	[CharacterAttribute.mana]: number

	[CharacterAttribute.strength]: number
	[CharacterAttribute.agility]: number
	[CharacterAttribute.charisma]: number
	[CharacterAttribute.wisdom]: number
	[CharacterAttribute.luck]: number
}

interface State extends BaseUState {
	name: string
	klass: CharacterClass
	attributes: CharacterAttributes
	// TODO inventory here ? equipped inventory ?
}

/////////////////////

export {
	CharacterAttribute,
	CharacterClass,
	CharacterAttributes,
	State,
}

/////////////////////
