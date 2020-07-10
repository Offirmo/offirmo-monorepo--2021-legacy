// we just expect this to compile

import { Enum } from 'typescript-string-enums'

import { BaseUState } from './types'

/////////////////////

const CharacterAttribute = Enum(
	'health',
	'mana',
)
type CharacterAttribute = Enum<typeof CharacterAttribute> // eslint-disable-line no-redeclare

const CharacterClass = Enum(
	'warrior',
	'wizard',
)
type CharacterClass = Enum<typeof CharacterClass> // eslint-disable-line no-redeclare

/////////////////////

interface CharacterAttributes {
	[CharacterAttribute.health]: number
	[CharacterAttribute.mana]: number
}

interface State extends BaseUState {
	name: string
	klass: CharacterClass
	attributes: CharacterAttributes
}

const state: State = {
	schema_version: 3,
	revision: 7,

	name: 'foo',
	//klass: 'foo',
	klass: 'wizard',
	attributes: {
		[CharacterAttribute.health]: 1,
		[CharacterAttribute.mana]: 1,
	},
	//xxx: 42,
}
