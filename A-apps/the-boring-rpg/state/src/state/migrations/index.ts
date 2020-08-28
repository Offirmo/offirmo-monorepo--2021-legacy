import deep_freeze from 'deep-freeze-strict'
import { LastMigrationStep, MigrationStep, SubStatesMigrations, CleanupStep, generic_migrate_to_latest } from '@offirmo-private/state'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'

import * as CharacterState from '@oh-my-rpg/state-character'
import * as WalletState from '@oh-my-rpg/state-wallet'
import * as InventoryState from '@oh-my-rpg/state-inventory'
import * as PRNGState from '@oh-my-rpg/state-prng'
import * as EnergyState from '@oh-my-rpg/state-energy'
import * as EngagementState from '@oh-my-rpg/state-engagement'
import * as CodesState from '@oh-my-rpg/state-codes'
import * as ProgressState from '@oh-my-rpg/state-progress'
import * as MetaState from '@oh-my-rpg/state-meta'

import { LIB, SCHEMA_VERSION } from '../../consts'
import { State } from '../../types'
import { OMRSoftExecutionContext } from '../../sec'
import { reset_and_salvage } from './salvage'

/////////////////////

// this state is a top one, not composable.
// hints are defined in the unit tests

/////////////////////

const SUB_STATES_MIGRATIONS: SubStatesMigrations = {
	avatar:     CharacterState.migrate_to_latest,
	inventory:  InventoryState.migrate_to_latest,
	wallet:     WalletState.migrate_to_latest,
	prng:       PRNGState.migrate_to_latest,
	energy:     EnergyState.migrate_to_latest,
	engagement: EngagementState.migrate_to_latest,
	codes:      CodesState.migrate_to_latest,
	progress:   ProgressState.migrate_to_latest,
	meta:       MetaState.migrate_to_latest,
}

export function migrate_to_latest(SEC: OMRSoftExecutionContext, legacy_state: Readonly<any>, hints: Readonly<any> = {}): State {
	let state: State = legacy_state as any // for starter

	try {
		state = generic_migrate_to_latest({
			SEC: SEC as any,

			LIB,
			SCHEMA_VERSION,
			legacy_state,
			hints,
			sub_states_migrate_to_latest: SUB_STATES_MIGRATIONS,
			cleanup,
			pipeline: [
				migrate_to_14x,
				migrate_to_13,
				migrate_to_12,
			]
		})

		// TODO migrate adventures
		// TODO migrate items
	}
	catch (err) {
		if (err.message.includes('more recent')) {
			// don't touch a more recent savegame!
			throw err
		}

		// attempt to salvage
		SEC.getInjectedDependencies().logger.error(`${LIB}: failed migrating schema, reseting and salvaging!`, {err})
		state = reset_and_salvage(legacy_state)
		SEC.fireAnalyticsEvent('schema_migration.salvaged', { step: 'main' })
	}

	return state
}

/*
function xxx_migrate_to_latest(SEC: OMRSoftExecutionContext, legacy_state: Readonly<any>, hints: Readonly<any> = {}): State {
		// 2nd part (can re-reset...)
		try {
			// migrate sub-reducers if any...
			let { u_state, t_state } = state

			;(function migrate_u_state() {
				u_state = { ...u_state } // TODO remove this systematic mutation if possible


				// up-to-date check
				if (Object.keys(u_state).length !== SUB_U_REDUCERS_COUNT + SUB_U_OTHER_KEYS_COUNT) {
					logger.error('migrate_to_latest', {
						SUB_U_REDUCERS_COUNT,
						SUB_U_OTHER_KEYS_COUNT,
						expected_count: SUB_U_REDUCERS_COUNT + SUB_U_OTHER_KEYS_COUNT,
						actual_count: Object.keys(u_state).length,
						actual_keys: Object.keys(u_state),
					})
					throw new Error('migrate_to_latest src [S.U.1] is outdated, please update!')
				}

				const sub_reducer_migrated = []
				u_state.avatar = CharacterState.migrate_to_latest(SEC, u_state.avatar, hints.avatar)
				sub_reducer_migrated.push('avatar')
				u_state.inventory = InventoryState.migrate_to_latest(SEC, u_state.inventory, hints.inventory)
				sub_reducer_migrated.push('inventory')
				u_state.wallet = WalletState.migrate_to_latest(SEC, u_state.wallet, hints.wallet)
				sub_reducer_migrated.push('wallet')
				u_state.prng = PRNGState.migrate_to_latest(SEC, u_state.prng, hints.prng)
				sub_reducer_migrated.push('prng')
				u_state.energy = EnergyState.migrate_to_latest(SEC, [ u_state.energy, t_state.energy ], hints.energy)[0]
				sub_reducer_migrated.push('energy')
				u_state.engagement = EngagementState.migrate_to_latest(SEC, u_state.engagement, hints.engagement)
				sub_reducer_migrated.push('engagement')
				u_state.codes = CodesState.migrate_to_latest(SEC, u_state.codes, hints.codes)
				sub_reducer_migrated.push('codes')
				u_state.progress = ProgressState.migrate_to_latest(SEC, u_state.progress, hints.progress)
				sub_reducer_migrated.push('progress')
				u_state.meta = MetaState.migrate_to_latest(SEC, u_state.meta, hints.meta)
				sub_reducer_migrated.push('meta')

				if (sub_reducer_migrated.length !== SUB_U_REDUCERS_COUNT)
					throw new Error('migrate_to_latest src [S.U.2] is outdated, please update!')
			})()

			;(function migrate_t_state() {
				if (Object.keys(t_state).length !== SUB_T_REDUCERS_COUNT + SUB_T_OTHER_KEYS_COUNT) {
					logger.error('migrate_to_latest', {
						SUB_T_REDUCERS_COUNT,
						SUB_T_OTHER_KEYS_COUNT,
						expected_count: SUB_T_REDUCERS_COUNT + SUB_T_OTHER_KEYS_COUNT,
						actual_count: Object.keys(t_state).length,
						actual_keys: Object.keys(t_state),
					})
					throw new Error('migrate_to_latest src [S.T.1] is outdated, please update!')
				}

				t_state = { ...t_state } // TODO remove this mutation if possible

				const sub_reducer_migrated = []
				t_state.energy = EnergyState.migrate_to_latest(SEC, [ u_state.energy, t_state.energy ], hints.energy)[1]
				sub_reducer_migrated.push('energy')

				if (sub_reducer_migrated.length !== SUB_T_REDUCERS_COUNT)
					throw new Error('migrate_to_latest src [S.T.2] is outdated, please update!')
			})()

			state = {
				...state,
				u_state,
				t_state,
			}
			logger.info(`${LIB}: schema migration from v${legacy_version} to v${SCHEMA_VERSION} successful.`)
			SEC.fireAnalyticsEvent('schema migration.ended')
		}
		catch (err) {
			SEC.fireAnalyticsEvent('schema_migration.failed', { step: 'sub' })
			// attempt to salvage
			logger.error(`${LIB}: failed migrating sub-reducers, reseting and salvaging!`, {err})
			state = reset_and_salvage(legacy_state)
			SEC.fireAnalyticsEvent('schema_migration.salvaged', { step: 'sub' })
		}

		return state
	})
}
*/
/////////////////////

const cleanup: CleanupStep<State> = (SEC, state, hints,) => {
	const { u_state } = state as any

	// micro migrations TODO clean
	if (u_state.uuid)
		delete u_state.uuid
	if (!u_state.last_user_action_tms)
		u_state.last_user_action_tms = get_UTC_timestamp_ms()

	return state
}

const migrate_to_14x: LastMigrationStep<State, any> = (SEC, legacy_state, hints, previous, legacy_schema_version) => {
	if (legacy_schema_version < 13)
		legacy_state = previous(SEC, legacy_state, hints)

	let state: State = legacy_state as State // for starter
	state.t_state.revision = 1 // new prop

	state.schema_version = 14
	state.t_state.schema_version = 14
	state.u_state.schema_version = 14

	return state
}

const migrate_to_13: MigrationStep<State, any> = (SEC, legacy_state, hints, previous, legacy_schema_version) => {
	if (legacy_state.schema_version < 12)
		legacy_state = previous(SEC, legacy_state, hints)

	let state: State = legacy_state as State // for starter

	if (state.u_state.last_adventure) {
		state.u_state.last_adventure = {
			...legacy_state.u_state.last_adventure,
			gains: {
				...legacy_state.u_state.last_adventure.gains,
				improvementⵧarmor: legacy_state.u_state.last_adventure.gains.armor_improvement,
				improvementⵧweapon: legacy_state.u_state.last_adventure.gains.weapon_improvement,
			},
		}
		delete (state.u_state.last_adventure?.gains as any)?.armor_improvement
		delete (state.u_state.last_adventure?.gains as any)?.weapon_improvement
	}
	state.u_state.meta = {
		...state.u_state.meta,
		persistence_id: state.u_state.meta.persistence_id || undefined,
	}

	state.schema_version = 13
	state.t_state.schema_version = 13
	state.u_state.schema_version = 13

	return state
}

const migrate_to_12: MigrationStep<State> = (SEC, legacy_state, hints, previous, legacy_schema_version) => {
	throw new Error('Alpha release outdated schema, won’t migrate, would take too much time and schema is still unstable!')
}
