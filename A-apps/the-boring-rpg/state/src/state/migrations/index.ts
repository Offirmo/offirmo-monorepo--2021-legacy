
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
import { OMRSoftExecutionContext, get_lib_SEC } from '../../sec'
import { reset_and_salvage } from './salvage'

/////////////////////

const SUB_U_REDUCERS_COUNT = 9
const SUB_U_OTHER_KEYS_COUNT = 5

const SUB_T_REDUCERS_COUNT = 1
const SUB_T_OTHER_KEYS_COUNT = 2


function migrate_to_latest(SEC: OMRSoftExecutionContext, legacy_state: Readonly<any>, hints: Readonly<any> = {}): State {
	const legacy_version = (() => {
		if (!legacy_state)
			return 0

		if (legacy_state.schema_version)
			return legacy_state.schema_version

		return 0
	})()

	SEC = get_lib_SEC(SEC)
		.setAnalyticsAndErrorDetails({
			version_from: legacy_version,
			version_to: SCHEMA_VERSION,
		})

	return SEC.xTry('migrate_to_latest', ({SEC, logger}) => {
		if (legacy_version > SCHEMA_VERSION)
			throw new Error('Your data is from a more recent version of this lib. Please update!')

		let state: State = legacy_state as State // for starter

		if (legacy_version < SCHEMA_VERSION) {
			logger.warn(`${LIB}: attempting to migrate schema from v${legacy_version} to v${SCHEMA_VERSION}:`)
			SEC.fireAnalyticsEvent('schema_migration.began')

			try {
				state = migrate_to_12(SEC, legacy_state, hints)
			}
			catch (err) {
				SEC.fireAnalyticsEvent('schema_migration.failed', { step: 'main' })
				// we are top, attempt to salvage
				logger.error(`${LIB}: failed migrating schema, reseting and salvaging!`, {err})
				state = reset_and_salvage(legacy_state)
				SEC.fireAnalyticsEvent('schema_migration.salvaged', { step: 'main' })
			}
		}

		// 2nd part (can re-reset...)
		try {
			// TODO migrate adventures
			// TODO migrate items

			// migrate sub-reducers if any...
			let { u_state, t_state } = state


			;(function migrate_u_state() {
				u_state = { ...u_state } // TODO remove this systematic mutation if possible

				// micro migrations TODO clean
				delete (u_state as any).uuid
				u_state.last_user_action_tms = u_state.last_user_action_tms || 0

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

/////////////////////

function migrate_to_12(SEC: OMRSoftExecutionContext, legacy_state: Readonly<any>, hints: Readonly<any>): any {
	if (legacy_state.schema_version >= 12)
		throw new Error('migrate_to_12 was called from an outdated/buggy root code, please update!')

	throw new Error('Alpha release outdated schema, won’t migrate, would take too much time and schema is still unstable!')
}

/////////////////////

export {
	SUB_U_REDUCERS_COUNT,
	migrate_to_latest,
}
