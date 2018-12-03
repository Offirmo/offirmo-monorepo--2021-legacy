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

const CharacterClass = Enum(
	// TODO more classes https://en.wikipedia.org/wiki/Character_class_(Dungeons_%26_Dragons)
	'novice',
	'warrior',
	'barbarian',
	'paladin',
	'sculptor',
	'pirate',
	'ninja',
	'rogue',
	'wizard',
	'hunter',
	'druid',
	'priest',
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
