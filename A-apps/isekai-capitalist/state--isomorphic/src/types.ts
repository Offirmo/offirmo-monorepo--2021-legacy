import { Enum } from 'typescript-string-enums'

import { TimestampUTCMs, HumanReadableTimestampUTCMinutes } from '@offirmo-private/timestamps'
import { UUID } from '@offirmo-private/uuid'
import {
	BaseUState,
	BaseTState,
	BaseRootState,
} from '@offirmo-private/state-utils'

import { State as WalletState } from '@oh-my-rpg/state-wallet'
import { State as PRNGState } from '@oh-my-rpg/state-prng'
import { State as EngagementState } from '@oh-my-rpg/state-engagement'
import { State as CodesState } from '@oh-my-rpg/state-codes'
import { State as MetaState } from '@oh-my-rpg/state-meta'

/////////////////////


/////////////////////

interface UState extends BaseUState {
	codes: CodesState
	engagement: EngagementState
	meta: MetaState
	prng: PRNGState
	wallet: WalletState
}

interface TState extends BaseTState {
}

/////////////////////

export {
	UState,
	TState,
}

/////////////////////
