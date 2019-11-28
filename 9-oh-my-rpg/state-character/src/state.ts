/////////////////////

import { Enum } from 'typescript-string-enums'

import { LIB, SCHEMA_VERSION } from './consts'

import {
	CharacterAttribute,
	CharacterClass,
	CharacterAttributes,
	State,
} from './types'

import { SoftExecutionContext, OMRContext, get_lib_SEC } from './sec'

/////////////////////

const DEFAULT_AVATAR_NAME = '[anonymous]'
const CHARACTER_ATTRIBUTES = Enum.keys(CharacterAttribute)
const CHARACTER_ATTRIBUTES_SORTED: Readonly<CharacterAttribute>[] = [
	'level',
	'health',
	'mana',
	'strength',
	'agility',
	'charisma',
	'wisdom',
	'luck',
]

get_lib_SEC().xTry('boot checks', () => {
	if (CHARACTER_ATTRIBUTES.length !== CHARACTER_ATTRIBUTES_SORTED.length)
		throw new Error(`${LIB}: CHARACTER_ATTRIBUTES to update!`)
})

const CHARACTER_CLASSES = Enum.keys(CharacterClass)

///////

function create(SEC?: SoftExecutionContext): Readonly<State> {
	return get_lib_SEC(SEC).xTry('create', ({enforce_immutability}: OMRContext) => {
		return enforce_immutability({
			schema_version: SCHEMA_VERSION,
			revision: 0,

			name: DEFAULT_AVATAR_NAME,
			klass: CharacterClass.novice,
			attributes: {
				level: 1,

				// TODO improve this one day
				health: 1,
				mana: 0,

				strength: 1,
				agility: 1,
				charisma: 1,
				wisdom: 1,
				luck: 1,
			},
		})
	})
}

/////////////////////

function rename(SEC: SoftExecutionContext, state: Readonly<State>, new_name: string): Readonly<State> {
	return get_lib_SEC(SEC).xTry('rename', ({enforce_immutability}: OMRContext) => {
		// TODO name normalization
		if (!new_name)
			throw new Error(`${LIB}: Error while renaming to "${new_name}": invalid target value!`) // TODO details
		if (new_name === state.name)
			return state

		return enforce_immutability({
			...state,
			name: new_name,
			revision: state.revision + 1,
		})
	})
}

function switch_class(SEC: SoftExecutionContext, state: Readonly<State>, klass: CharacterClass): Readonly<State> {
	return get_lib_SEC(SEC).xTry('switch_class', ({enforce_immutability}: OMRContext) => {
		if (klass === state.klass)
			return state

		if (!Enum.isType(CharacterClass, klass))
			throw new Error(`${LIB}: "${klass}" is not a valid class!`)

		return enforce_immutability({
			...state,
			klass,
			revision: state.revision + 1,
		})
	})
}

function increase_stat(SEC: SoftExecutionContext, state: Readonly<State>, stat: CharacterAttribute, amount = 1): Readonly<State> {
	return get_lib_SEC(SEC).xTry('increase_stat', ({enforce_immutability}: OMRContext) => {
		if (amount <= 0)
			throw new Error(`${LIB}: Error while increasing stat "${stat}": invalid amount!`) // TODO details

		// TODO stats caps?

		return enforce_immutability({
			...state,
			attributes: {
				...state.attributes,
				[stat]: state.attributes[stat] + amount,
			},
			revision: state.revision + 1,
		})
	})
}

/////////////////////

export {
	CharacterAttribute,
	CharacterClass,
	CharacterAttributes,
	State,

	DEFAULT_AVATAR_NAME,
	CHARACTER_ATTRIBUTES,
	CHARACTER_ATTRIBUTES_SORTED,
	CHARACTER_CLASSES,

	create,
	rename,
	switch_class,
	increase_stat,
}

/////////////////////
