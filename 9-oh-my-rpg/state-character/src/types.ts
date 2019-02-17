import { Enum } from 'typescript-string-enums'

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
	level: number

	health: number
	mana: number

	strength: number
	agility: number
	charisma: number
	wisdom: number
	luck: number
}

interface State {
	schema_version: number
	revision: number

	name: string
	klass: CharacterClass
	attributes: CharacterAttributes
	// TODO equipped inventory here ?
}

/////////////////////

export {
	CharacterAttribute,
	CharacterClass,
	CharacterAttributes,
	State,
}

/////////////////////
