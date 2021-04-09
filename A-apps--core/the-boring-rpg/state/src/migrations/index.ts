import { Immutable, LastMigrationStep, MigrationStep, SubStatesMigrations, CleanupStep, generic_migrate_to_latest } from '@offirmo-private/state-utils'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'

import * as CharacterState from '@tbrpg/state--character'
import * as WalletState from '@oh-my-rpg/state-wallet'
import * as InventoryState from '@oh-my-rpg/state-inventory'
import * as PRNGState from '@oh-my-rpg/state-prng'
import * as EnergyState from '@oh-my-rpg/state-energy'
import * as EngagementState from '@oh-my-rpg/state-engagement'
import * as CodesState from '@oh-my-rpg/state-codes'
import * as ProgressState from '@oh-my-rpg/state-progress'
import * as MetaState from '@oh-my-rpg/state-meta'

import { LIB, SCHEMA_VERSION } from '../consts'
import { State } from '../types'
import { OMRSoftExecutionContext } from '../services/sec'
import { _refresh_achievements } from '../reducers/achievements'
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

export function migrate_to_latest(SEC: OMRSoftExecutionContext, legacy_state: Immutable<any>, hints: Immutable<any> = {}): Immutable<State> {
	let state = legacy_state as Immutable<State> // for starter

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

/////////////////////

export const cleanup: CleanupStep<State> = (SEC, state, hints) => {
	let has_change = false

	// HACK
	// new achievements may appear thanks to new content !== migration
	// this is covered semantically in ~start_session()
	// HOWEVER if we don't do it here,
	// it makes it difficult to test the migration of old savegames with less content.
	// HENCE we refresh the achievements here, for test simplicity, even when it's not 100% semantic
	state = _refresh_achievements(state)

	let { u_state, t_state } = state

	// micro migrations TODO clean
	if ((u_state as any).uuid) {
		u_state = {
			...u_state
		}
		delete (u_state as any).uuid
		has_change = true
	}
	if (!u_state.last_user_action_tms) {
		u_state = {
			...u_state,
			last_user_action_tms: get_UTC_timestamp_ms(),
		}
		has_change = true
	}

	// introduced late: min wallet always >0
	if (WalletState.get_currency_amount(u_state.wallet, WalletState.Currency.coin) <= 0) {
		u_state = {
			...u_state,
			wallet: WalletState.add_amount(u_state.wallet, WalletState.Currency.coin, 1),
		}
		has_change = true
	}

	if (!has_change)
		return state

	return {
		...state,
		u_state,
		t_state,
	}
}

const migrate_to_14x: LastMigrationStep<State, any> = (SEC, legacy_state, hints, previous, legacy_schema_version) => {
	if (legacy_schema_version < 13)
		legacy_state = previous(SEC, legacy_state, hints)

	let state = legacy_state as any // for starter

	state = {
		...state,
		t_state: {
			...state.t_state,
			revision: 0 // new prop
		},
	}

	if (state.u_state.last_adventure) {
		state.u_state = {
			...state.u_state,
			last_adventure: {
				...state.u_state.last_adventure,
				encounter: state.u_state.last_adventure.encounter || null,
			}
		}
	}

	state = {
		...state,
		schema_version: 14,
		u_state: {
			...state.u_state,
			schema_version: 14,
		},
		t_state: {
			...state.t_state,
			schema_version: 14,
		},
	}

	return state
}

const migrate_to_13: MigrationStep<State, any> = (SEC, legacy_state, hints, previous, legacy_schema_version) => {
	if (legacy_schema_version < 12)
		legacy_state = previous(SEC, legacy_state, hints)

	let state = legacy_state as any // for starter

	if (state.u_state.last_adventure) {
		state = {
			...state,
			u_state: {
				...state.u_state,
				last_adventure: {
					...state.u_state.last_adventure,
					gains: {
						...state.u_state.last_adventure.gains,
						improvementⵧarmor: legacy_state.u_state.last_adventure.gains.armor_improvement,
						improvementⵧweapon: legacy_state.u_state.last_adventure.gains.weapon_improvement,
					},
				}
			}
		}
		delete (state.u_state.last_adventure.gains as any)?.armor_improvement
		delete (state.u_state.last_adventure.gains as any)?.weapon_improvement
	}

	state = {
		...state,
		schema_version: 13,
		u_state: {
			...state.u_state,
			schema_version: 13,
		},
		t_state: {
			...state.t_state,
			schema_version: 13,
		},
	}

	return state
}

const migrate_to_12: MigrationStep<State> = (SEC, legacy_state, hints, previous, legacy_schema_version) => {
	throw new Error('Alpha release outdated schema, won’t migrate, would take too much time and schema is still unstable!')
}
