/////////////////////

import { generate_uuid } from '@oh-my-rpg/definitions'

import * as MetaState from '@oh-my-rpg/state-meta'
import * as CharacterState from '@oh-my-rpg/state-character'
import * as WalletState from '@oh-my-rpg/state-wallet'
import * as InventoryState from '@oh-my-rpg/state-inventory'
import * as PRNGState from '@oh-my-rpg/state-prng'


import { LIB_ID, SCHEMA_VERSION } from './consts'
import { State } from './types'
import { create, OLDEST_LEGACY_STATE_FOR_TESTS } from './state'
import { SoftExecutionContext, SECContext, get_SEC } from './sec'

/////////////////////

function migrate_to_latest(SEC: SoftExecutionContext, legacy_state: any, hints: any = {}): State {
	return get_SEC(SEC).xTry('migrate_to_latest', ({SEC, logger}: SECContext) => {
		const src_version = (legacy_state && legacy_state.schema_version) || 0

		let state: State = create()

		if (!legacy_state || Object.keys(legacy_state).length === 0) {
			// = empty or empty object (happen, with some deserialization techniques)
			// It's a new state, keep the freshly created one.
		} else if (src_version === SCHEMA_VERSION)
			state = legacy_state as State
		else if (src_version > SCHEMA_VERSION)
			throw new Error(`Your data is from a more recent version of this lib. Please update!`)
		else {
			try {
				// TODO logger
				console.warn(`${LIB_ID}: attempting to migrate schema from v${src_version} to v${SCHEMA_VERSION}:`)
				state = migrate_to_4(SEC, legacy_state, hints)
				console.info(`${LIB_ID}: schema migration successful.`)
			}
			catch (err) {
				// failed, reset all
				// TODO send event upwards
				console.error(`${LIB_ID}: failed migrating schema, performing full reset !`, err)
				state = create()
			}
		}

		// migrate sub-reducers if any...
		state.meta = MetaState.migrate_to_latest(state.meta, hints.meta)
		state.avatar = CharacterState.migrate_to_latest(SEC, state.avatar, hints.avatar)
		state.inventory = InventoryState.migrate_to_latest(state.inventory, hints.inventory)
		state.wallet = WalletState.migrate_to_latest(state.wallet, hints.wallet)
		state.prng = PRNGState.migrate_to_latest(state.prng, hints.prng)

		return state
	})
}

/////////////////////

function migrate_to_4(SEC: SoftExecutionContext, legacy_state: any, hints: any): any {
	return SEC.xTry('migrate_to_4', ({logger}: SECContext) => {
		throw new Error(`Alpha release schema, won't migrate, would take too much time and schema is still unstable!`)
	})
}

/////////////////////

export {
	migrate_to_latest,
}
