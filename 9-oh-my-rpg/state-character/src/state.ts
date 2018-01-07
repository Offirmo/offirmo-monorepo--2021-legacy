/////////////////////

import { Enum } from 'typescript-string-enums'
import * as deepFreeze from 'deep-freeze-strict'

import { SCHEMA_VERSION } from './consts'

import {
	CharacterAttribute,
	CharacterClass,
	CharacterAttributes,
	State,
} from './types'

import { SoftExecutionContext, SECContext, get_SEC } from './sec'

/////////////////////

const CHARACTER_ATTRIBUTES = Enum.keys(CharacterAttribute)
const CHARACTER_ATTRIBUTES_SORTED: CharacterAttribute[] = [
	'level',
	'health',
	'mana',

	'strength',
	'agility',
	'charisma',
	'wisdom',
	'luck',
]

get_SEC().xTry('boot checks', () => {
	if (CHARACTER_ATTRIBUTES.length !== CHARACTER_ATTRIBUTES_SORTED.length)
		throw new Error(`CHARACTER_ATTRIBUTES to update!`)
})

const CHARACTER_CLASSES = Enum.keys(CharacterClass)

///////

function create(SEC: SoftExecutionContext): State {
	return get_SEC(SEC).xTry('create', ({enforce_immutability}: SECContext) => {
		return enforce_immutability({
			schema_version: SCHEMA_VERSION,
			revision: 0,

			name: '[anonymous]',
			klass: CharacterClass.novice,
			attributes: {
				level: 1,

				// TODO improve this
				health: 1,
				mana: 0,

				strength: 1,
				agility: 1,
				charisma: 1,
				wisdom: 1,
				luck: 1
			},
		})
	})
}

/////////////////////

function rename(SEC: SoftExecutionContext, state: State, new_name: string): State {
	return get_SEC(SEC).xTry('rename', ({enforce_immutability}: SECContext) => {
		if (!new_name)
			throw new Error(`Error while renaming to "${new_name}: invalid target value!`) // TODO details
		if (new_name === state.name)
			return state

		return enforce_immutability({
			...state,
			name: new_name,
			revision: state.revision + 1,
		})
	})
}

function switch_class(SEC: SoftExecutionContext, state: State, klass: CharacterClass): State {
	return get_SEC(SEC).xTry('switch_class', ({enforce_immutability}: SECContext) => {
		if (klass === state.klass)
			return state

		return enforce_immutability({
			...state,
			klass,
			revision: state.revision + 1,
		})
	})
}

function increase_stat(SEC: SoftExecutionContext, state: State, stat: CharacterAttribute, amount = 1): State {
	return get_SEC(SEC).xTry('increase_stat', ({enforce_immutability}: SECContext) => {
		if (amount <= 0)
			throw new Error(`Error while increasing stat "${stat}": invalid amount!`) // TODO details

		// TODO stats caps

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

// needed to test migrations, both here and in composing parents

// a full featured, non-trivial demo state
// needed for demos
const DEMO_STATE: State = deepFreeze({
	schema_version: 2,
	revision: 42,

	name: 'Perte',
	klass: CharacterClass.paladin,
	attributes: {
		level: 13,

		health: 12,
		mana: 23,

		strength: 4,
		agility: 5,
		charisma: 6,
		wisdom: 7,
		luck: 8,
	},
})

// the oldest format we can migrate from
// must correspond to state above
const OLDEST_LEGACY_STATE_FOR_TESTS: any = deepFreeze({
	// no schema_version = 0
	name: 'Perte',
	klass: 'paladin',
	characteristics: {
		level: 13,

		health: 12,
		mana: 23,

		strength: 4,
		agility: 5,
		charisma: 6,
		wisdom: 7,
		luck: 8,
	},
})

// some hints may be needed to migrate to demo state
const MIGRATION_HINTS_FOR_TESTS: any = deepFreeze({
	to_v2: {
		revision: 42
	},
})

/////////////////////

export {
	CharacterAttribute,
	CharacterClass,
	CharacterAttributes,
	State,

	CHARACTER_ATTRIBUTES,
	CHARACTER_ATTRIBUTES_SORTED,
	CHARACTER_CLASSES,


	create,
	rename,
	switch_class,
	increase_stat,

	DEMO_STATE,
	OLDEST_LEGACY_STATE_FOR_TESTS,
	MIGRATION_HINTS_FOR_TESTS,
}

/////////////////////
