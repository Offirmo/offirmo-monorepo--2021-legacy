/////////////////////

import * as CharacterState from '@oh-my-rpg/state-character'
import * as WalletState from '@oh-my-rpg/state-wallet'
import * as InventoryState from '@oh-my-rpg/state-inventory'
import * as PRNGState from '@oh-my-rpg/state-prng'
import * as EnergyState from '@oh-my-rpg/state-energy'
import * as EngagementState from '@oh-my-rpg/state-engagement'
import * as CodesState from '@oh-my-rpg/state-codes'

import { LIB, SCHEMA_VERSION } from '../../consts'
import { State } from '../../types'
import { create } from '../state'
import { SoftExecutionContext, OMRContext, get_lib_SEC } from '../../sec'

/////////////////////

function reset_and_salvage(legacy_state: any): State {
	let state = create()

	// still, try to salvage "meta" for engagement
	try {

		// ensure this code is up to date
		if (typeof state.avatar.name !== 'string') {
			// TODO report
			console.warn(`${LIB}: need to update the avatar name salvaging!`)
			return create()
		}
		if (typeof legacy_state.avatar.name === 'string') {
			state.avatar.name = legacy_state.avatar.name
		}

		// TODO salvage creation date as well?
		// TODO auto-replay as much?

		console.info(`${LIB}: salvaged some savegame data.`)
	}
	catch (err) {
		/* swallow */
		console.warn(`${LIB}: salvaging failed!`)
		state = create()
	}
	return state
}

const SUB_REDUCERS_COUNT = 7
const OTHER_KEYS_COUNT = 7

function migrate_to_latest(SEC: SoftExecutionContext, legacy_state: any, hints: any = {}): State {
	const existing_version = (legacy_state && legacy_state.schema_version) || 0

	SEC = get_lib_SEC(SEC)
		.setAnalyticsAndErrorDetails({
			version_from: existing_version,
			version_to: SCHEMA_VERSION,
		})

	return SEC.xTry('migrate_to_latest', ({SEC, logger}: OMRContext) => {
		if (existing_version > SCHEMA_VERSION)
			throw new Error('Your data is from a more recent version of this lib. Please update!')

		let state: State = legacy_state as State // for starter

		// micro pseudo-migrations (TODO clean)
		if (!state.codes)
			state.codes = CodesState.create(SEC)
		if (!state.engagement)
			state.engagement = EngagementState.create(SEC)
		if (legacy_state.meaningful_interaction_count)
			delete legacy_state.meaningful_interaction_count

		if (existing_version < SCHEMA_VERSION) {
			logger.warn(`attempting to migrate schema from v${existing_version} to v${SCHEMA_VERSION}:`)
			SEC.fireAnalyticsEvent('schema_migration.began')

			try {
				state = migrate_to_4(SEC, legacy_state, hints)
				logger.info('schema migration successful.')
				SEC.fireAnalyticsEvent('schema migration.ended')
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
			// TODO migrate adventures??

			// migrate sub-reducers if any...

			if (Object.keys(state).length !== SUB_REDUCERS_COUNT + OTHER_KEYS_COUNT) {
				logger.error('migrate_to_latest', {SUB_REDUCERS_COUNT, OTHER_KEYS_COUNT, actual_count: Object.keys(state).length, keys: Object.keys(state)})
				throw new Error('migrate_to_latest src (1) is outdated, please update!')
			}

			let count = 0
			state.avatar = CharacterState.migrate_to_latest(SEC, state.avatar, hints.avatar)
			count++
			state.inventory = InventoryState.migrate_to_latest(state.inventory, hints.inventory)
			count++
			state.wallet = WalletState.migrate_to_latest(state.wallet, hints.wallet)
			count++
			state.prng = PRNGState.migrate_to_latest(state.prng, hints.prng)
			count++
			state.energy = EnergyState.migrate_to_latest(state.energy, hints.energy)
			count++
			state.engagement = EngagementState.migrate_to_latest(SEC, state.engagement, hints.engagement)
			count++
			state.codes = CodesState.migrate_to_latest(SEC, state.codes, hints.codes)
			count++

			if (count !== SUB_REDUCERS_COUNT) {
				throw new Error('migrate_to_latest src (2) is outdated, please update!')
			}
		}
		catch (err) {
			SEC.fireAnalyticsEvent('schema_migration.failed', { step: 'sub' })
			// we are top, attempt to salvage
			logger.error(`${LIB}: failed migrating sub-reducers, reseting and salvaging!`, {err})
			state = reset_and_salvage(legacy_state)
			SEC.fireAnalyticsEvent('schema_migration.salvaged', { step: 'sub' })
		}

		return state
	})
}

/////////////////////

function migrate_to_4(SEC: SoftExecutionContext, legacy_state: any, hints: any): any {
	throw new Error('Alpha release schema, won\'t migrate, would take too much time and schema is still unstable!')
}

/////////////////////

export {
	migrate_to_latest,
}
