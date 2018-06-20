import { Enum } from 'typescript-string-enums'

import { HumanReadableTimestampUTCMinutes } from '@oh-my-rpg/timestamps'
import { UUID } from '@offirmo/uuid'

import { Weapon } from '@oh-my-rpg/logic-weapons'
import { Armor } from '@oh-my-rpg/logic-armors'
import { Monster } from '@oh-my-rpg/logic-monsters'

import { State as CharacterState } from '@oh-my-rpg/state-character'
import { State as InventoryState } from '@oh-my-rpg/state-inventory'
import { State as WalletState } from '@oh-my-rpg/state-wallet'
import { State as PRNGState } from '@oh-my-rpg/state-prng'
import { State as EnergyState } from '@oh-my-rpg/state-energy'

/////////////////////

const GainType = Enum(
	// Note: must match properties in Adventure['gains']
	'level',
	'health',
	'mana',
	'strength',
	'agility',
	'charisma',
	'wisdom',
	'luck',
	'coin',
	'token',
	'weapon',
	'armor',
	'weapon_improvement',
	'armor_improvement',
)
type GainType = Enum<typeof GainType>


interface Adventure {
	uuid: UUID
	hid: string
	good: boolean
	encounter?: Monster,
	gains: {
		level: number
		health: number
		mana: number
		strength: number
		agility: number
		charisma: number
		wisdom: number
		luck: number
		coin: number
		token: number
		weapon: null | Weapon
		armor: null | Armor
		weapon_improvement: boolean,
		armor_improvement: boolean,
	}
}

/////////////////////

interface State {
	schema_version: number
	revision: number

	uuid: UUID
	creation_date: HumanReadableTimestampUTCMinutes

	avatar: CharacterState
	inventory: InventoryState
	wallet: WalletState
	prng: PRNGState
	last_adventure: Adventure | null
	energy: EnergyState

	// TODO rename click to something more generic
	click_count: number
	good_click_count: number
	meaningful_interaction_count: number
}

/////////////////////

export {
	GainType,
	Adventure,
	State,
}

/////////////////////
