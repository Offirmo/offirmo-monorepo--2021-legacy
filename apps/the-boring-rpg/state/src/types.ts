import { Enum } from 'typescript-string-enums'

import { HumanReadableTimestampUTCMinutes } from '@offirmo/timestamps'
import { UUID } from '@offirmo/uuid'

import { Weapon } from '@oh-my-rpg/logic-weapons'
import { Armor } from '@oh-my-rpg/logic-armors'
import { Monster } from '@oh-my-rpg/logic-monsters'

import { State as CharacterState } from '@oh-my-rpg/state-character'
import { State as InventoryState } from '@oh-my-rpg/state-inventory'
import { State as WalletState } from '@oh-my-rpg/state-wallet'
import { State as PRNGState } from '@oh-my-rpg/state-prng'
import {
	UState as EnergyUState,
	TState as EnergyTState
} from '@oh-my-rpg/state-energy'
import { State as EngagementState } from '@oh-my-rpg/state-engagement'
import { State as CodesState } from '@oh-my-rpg/state-codes'
import { State as ProgressState } from '@oh-my-rpg/state-progress'

import { AchievementStatus } from '@oh-my-rpg/state-progress'

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
type GainType = Enum<typeof GainType> // eslint-disable-line no-redeclare


interface Adventure {
	readonly uuid: UUID
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

interface UState {
	revision: number

	readonly uuid: UUID // TODO review
	creation_date: HumanReadableTimestampUTCMinutes

	avatar: CharacterState
	inventory: InventoryState
	wallet: WalletState
	prng: PRNGState
	energy: EnergyUState,
	engagement: EngagementState
	codes: CodesState
	progress: ProgressState

	last_adventure: Adventure | null
}

interface TState {
	energy: EnergyTState,
}

interface State {
	schema_version: number

	u_state: UState

	t_state: TState
}

/////////////////////

export {
	GainType,
	Adventure,
	UState,
	TState,
	State,
}

/////////////////////
