import deepFreeze from 'deep-freeze-strict'
import assert from 'tiny-invariant'
import { SoftExecutionContext } from '@offirmo-private/soft-execution-context'

import { LIB } from './consts'
import {BaseTState, BaseUState, WithSchemaVersion} from './types'
import { get_schema_version_loose } from './selectors'


/////////////////////

export interface Libs {
	deep_freeze: typeof deepFreeze,
}
const LIBS: Libs = {
	deep_freeze: deepFreeze,
}

export type GenericMigration<State = any, OlderState = any> = (
	SEC: SoftExecutionContext,
	legacy_state: Readonly<OlderState>,
	hints: Readonly<any>,
) => State

export type MigrationStep<State = any, OlderState = any> = (
	SEC: SoftExecutionContext,
	legacy_state: Readonly<OlderState>,
	hints: Readonly<any>,
	previous: GenericMigration<OlderState>,
	// for convenience:
	legacy_schema_version: number,
	libs: Libs,
) => State

export type LastMigrationStep<State, OlderState = any> = MigrationStep<State, OlderState>

export type CleanupStep<State> = (
	SEC: SoftExecutionContext,
	state: Readonly<State>,
	hints: Readonly<any>,
) => State


export function generic_migrate_to_latest<State>({
	SEC,

	SCHEMA_VERSION,
	legacy_state,
	hints,
	sub_states = [],
	pipeline
}: {
	SEC: SoftExecutionContext
	SCHEMA_VERSION: number
	legacy_state: Readonly<any>,
	hints: any,
	sub_states: string[]
	pipeline: readonly [
		LastMigrationStep<State>,
		...MigrationStep[]
	]
}): State {
	return SEC.xTry('migrate_to_latest', ({SEC, logger}) => {
		const existing_version = get_schema_version_loose(legacy_state)

		SEC.setLogicalStack({module: LIB})
		SEC.setAnalyticsAndErrorDetails({
			version_from: existing_version,
			version_to: SCHEMA_VERSION,
		})

		if (existing_version > SCHEMA_VERSION)
			throw new Error('Your data is from a more recent version of this lib. Please update!')

		let state: State = legacy_state as State // for starter, may actually be true

		if (existing_version < SCHEMA_VERSION) {
			logger.warn(`attempting to migrate schema from v${existing_version} to v${SCHEMA_VERSION}…`)
			SEC.fireAnalyticsEvent('schema_migration.began')

			function previous(
				index: number,
				SEC: SoftExecutionContext,
				legacy_state: Readonly<any>,
				hints: Readonly<any>,
			): any {
				/*if (index > 0) {
					_check_response(_last_SEC, index - 1, 'in')
				}*/

				if (index >= pipeline.length)
					return

				const current_step_name = pipeline[index].name || 'unknown'
				return SEC.xTry('migration step:' + current_step_name, ({ SEC }) => {
					const legacy_schema_version = get_schema_version_loose(legacy_state)
					//_last_SEC = SEC
					//console.log('_last_SEC now =', SEC.getLogicalStack(), '\n', SEC.getShortLogicalStack())
					logger.trace(`[${LIB}] ⭆ invoking data migration step ${index+1}/${pipeline.length} "${current_step_name}"…`, {legacy_state})
					const state = pipeline[index](
						SEC,
						legacy_state,
						hints,
						previous.bind(null, index + 1),
						legacy_schema_version,
						LIBS,
					)
					logger.trace(`[${LIB}] ⭅ returned from data migration step ${index+1}/${pipeline.length} "${current_step_name}"…`, {state})
					//_check_response(SEC, index, 'out')
					return state
				})
			}

			// launch the chain
			try {
				legacy_state = previous(0, SEC, legacy_state, hints)
			}
			catch (err) {
				SEC.fireAnalyticsEvent('schema_migration.failed')
				throw err
			}

			logger.info(`${LIB}: schema migration successful.`, { state: legacy_state })
			SEC.fireAnalyticsEvent('schema_migration.ended')
		}

		// migrate sub-reducers if any...
		sub_states.forEach(key => {
			throw new Error('NIMP!')
		})

		// clean
		throw new Error('NIMP!')


		return state
	})

}


/*
<State extends WithSchemaVersion>(SEC: SoftExecutionContext, legacy_state: Readonly<any>, hints: Readonly<any> = {}): State {

}

/////////////////////

function migrate_to_13(SEC: SoftExecutionContext, legacy_state: Readonly<any>, hints: Readonly<any>): any {
	if (legacy_state.schema_version >= 13)
		throw new Error('migrate_to_13 was called from an outdated/buggy root code, please update!')
	if (legacy_state.schema_version < 12)
		legacy_state = migrate_to_12x(SEC, legacy_state, hints)

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

function migrate_to_2(SEC: SoftExecutionContext, legacy_state: Readonly<any>, hints: Readonly<any>): State {
	throw new Error('Schema is too old (pre-beta), can’t migrate!')
}

/////////////////////

export {
	migrate_to_latest,
	MIGRATION_HINTS_FOR_TESTS,
}
*/
