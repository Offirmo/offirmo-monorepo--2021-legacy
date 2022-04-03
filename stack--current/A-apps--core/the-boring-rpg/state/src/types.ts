import { Enum } from 'typescript-string-enums'

import { TimestampUTCMs, HumanReadableTimestampUTCMinutes } from '@offirmo-private/timestamps'
import { UUID } from '@offirmo-private/uuid'
import {
	BaseUState,
	BaseTState,
	BaseRootState,
} from '@offirmo-private/state-utils'

import { Weapon } from '@oh-my-rpg/logic-weapons'
import { Armor } from '@oh-my-rpg/logic-armors'
import { Monster } from '@oh-my-rpg/logic-monsters'

import { State as CharacterState } from '@tbrpg/state--character'
import { State as InventoryState } from '@tbrpg/state--inventory'
import { State as WalletState } from '@oh-my-rpg/state-wallet'
import { State as PRNGState } from '@oh-my-rpg/state-prng'
import {
	UState as EnergyUState,
	TState as EnergyTState,
} from '@oh-my-rpg/state-energy'
import { State as EngagementState } from '@oh-my-rpg/state-engagement'
import { State as CodesState } from '@oh-my-rpg/state-codes'
import { State as ProgressState } from '@tbrpg/state--progress'
import { State as MetaState } from '@oh-my-rpg/state-meta'

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
	'improvementⵧweapon',
	'improvementⵧarmor',
)
type GainType = Enum<typeof GainType> // eslint-disable-line no-redeclare


interface Adventure {
	readonly uuid: UUID
	hid: string
	good: boolean
	encounter: Monster | null,
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
		improvementⵧweapon: boolean,
		improvementⵧarmor: boolean,
	}
}

/////////////////////

interface UState extends BaseUState {
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

interface State extends BaseRootState<UState, TState> {
	schema_version: number // yes it's redundant but very convenient for debugging in the console
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
