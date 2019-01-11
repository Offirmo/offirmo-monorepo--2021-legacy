/////////////////////

import { Random, Engine } from '@offirmo/random'
import deepFreeze from 'deep-freeze-strict'

/////////////////////

import {
	CharacterAttribute,
	CharacterAttributes,
	CharacterClass,
	increase_stat,
	rename,
	switch_class,
} from '@oh-my-rpg/state-character'


import * as Character from '@oh-my-rpg/state-character'
import * as Inventory from '@oh-my-rpg/state-inventory'
import * as Wallet from '@oh-my-rpg/state-wallet'
import * as PRNG from '@oh-my-rpg/state-prng'
import * as Energy from '@oh-my-rpg/state-energy'
import * as Engagement from '@oh-my-rpg/state-engagement'
import * as Codes from '@oh-my-rpg/state-codes'
import * as Progress from '@oh-my-rpg/state-progress'

import { DEMO_WEAPON_1 } from '@oh-my-rpg/logic-weapons'
import { DEMO_MONSTER_01 } from '@oh-my-rpg/logic-monsters'

/////////////////////

import { SCHEMA_VERSION } from './consts'
import { State, Adventure } from './types'

/////////////////////

// needed to test migrations, both here and in composing parents

// a full featured, non-trivial demo state
// with dev gain
const DEMO_ADVENTURE_01: Readonly<Adventure> = deepFreeze({
	hid: 'fight_lost_any',
	uuid: 'uu1de1~EVAdXlW5_p23Ro4OH',
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
		armor_improvement: false,
		weapon_improvement: false,
	},
})
// with coin gain
const DEMO_ADVENTURE_02: Readonly<Adventure> = deepFreeze({
	hid: 'dying_man',
	uuid: 'uu1de2~p23Ro4OH_EVAdXlW5',
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
		weapon_improvement: false,
		armor_improvement: false,
	}
})
// with loot gain
const DEMO_ADVENTURE_03: Readonly<Adventure> = deepFreeze({
	hid: 'rare_goods_seller',
	uuid: 'uu1de2~p23Ro4OH_EVAdXlW5',
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
		weapon_improvement: false,
		armor_improvement: false,
	}
})
// with weapon enhancement gain
const DEMO_ADVENTURE_04: Adventure = deepFreeze({
	hid: 'princess',
	uuid: 'uu1de2~p23Ro4OH_EVAdXlW5',
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
		weapon_improvement: false,
		armor_improvement: true,
	}
})

const DEMO_STATE: Readonly<State> = deepFreeze({
	uuid: "uu1EO9VgTjPlR1YPj0yfdWjG",
	creation_date: "20180813_00h33",

	schema_version: SCHEMA_VERSION,
	revision: 203,

	avatar: Character.DEMO_STATE,
	inventory: Inventory.DEMO_STATE,
	wallet: Wallet.DEMO_STATE,
	prng: PRNG.DEMO_STATE,
	energy: [ Energy.DEMO_U_STATE, Energy.DEMO_T_STATE ] as State["energy"],
	engagement: Engagement.DEMO_STATE,
	codes: Codes.DEMO_STATE,
	progress: Progress.DEMO_STATE,

	last_adventure: DEMO_ADVENTURE_01,
})

/////////////////////

export {
	DEMO_ADVENTURE_01,
	DEMO_ADVENTURE_02,
	DEMO_ADVENTURE_03,
	DEMO_ADVENTURE_04,
	DEMO_STATE,
}

/////////////////////
