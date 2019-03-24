import { Enum } from 'typescript-string-enums'

import { TimestampUTCMs, HumanReadableTimestampUTCMinutes } from '@offirmo/timestamps'
import { UUID } from '@offirmo/uuid'
import {
	BaseUState,
	BaseTState,
	BaseRootState,
} from '@offirmo-private/state'

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
import { State as MetaState } from '@oh-my-rpg/state-meta'

//import { BaseState, BaseRootState } from './utils/state'

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

interface UState extends BaseUState {
	creation_date: HumanReadableTimestampUTCMinutes // TODO useful? move to progress?
	last_user_action_tms: TimestampUTCMs

	avatar: CharacterState
	codes: CodesState
	energy: EnergyUState,
	engagement: EngagementState
	inventory: InventoryState
	meta: MetaState
	prng: PRNGState
	progress: ProgressState
	wallet: WalletState

	last_adventure: Adventure | null
}

interface TState extends BaseTState {
	energy: EnergyTState,
}

interface State extends BaseRootState {
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
