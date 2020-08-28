import deep_freeze from 'deep-freeze-strict'
import assert from 'tiny-invariant'
import { SoftExecutionContext } from '@offirmo-private/soft-execution-context'

import { AnyRootState } from './types--internal'
import { get_schema_version_loose } from './selectors'
import { is_UState, is_TState, is_RootState } from './type-guards'


////////////////////////////////////////////////////////////////////////////////////

export interface Libs {
	deep_freeze: typeof deep_freeze,
}
const LIBS: Libs = {
	deep_freeze: deep_freeze,
}

export type GenericMigration<State = any, OlderState = any> = (
	SEC: SoftExecutionContext<any, any, any>,
	legacy_state: Readonly<OlderState>,
	hints: Readonly<any>,
) => State

export type MigrationStep<State = any, OlderState = any> = (
	SEC: SoftExecutionContext<any, any, any>,
	legacy_state: Readonly<OlderState>,
	hints: Readonly<any>,
	previous: GenericMigration<OlderState>,
	// for convenience:
	legacy_schema_version: number,
	libs: Libs,
) => State

export type LastMigrationStep<State, OlderState = any> = MigrationStep<State, OlderState>

export type CleanupStep<State> = (
	SEC: SoftExecutionContext<any, any, any>,
	state: Readonly<State>,
	hints: Readonly<any>,
) => State

export type SubStatesMigrations = { [key: string]: GenericMigration }

////////////////////////////////////////////////////////////////////////////////////

export function generic_migrate_to_latest<State>({
	SEC,

	LIB,
	SCHEMA_VERSION,
	legacy_state,
	hints,
	sub_states, // no default to force thinking
	cleanup = (SEC, state, hints) => state,
	pipeline,
}: {
	SEC: SoftExecutionContext
	LIB: string
	SCHEMA_VERSION: number
	legacy_state: Readonly<any>
	hints: any
	sub_states: SubStatesMigrations
	cleanup?: CleanupStep<State>
	pipeline: readonly [
		LastMigrationStep<State>,
		...MigrationStep[],
	]
}): State {
	return SEC.xTry('migrate_to_latest', ({SEC, logger}) => {
		const existing_version = get_schema_version_loose(legacy_state)

		const RSEC = SEC
		RSEC.setLogicalStack({ module: LIB })
		RSEC.setAnalyticsAndErrorDetails({
			version_from: existing_version,
			version_to: SCHEMA_VERSION,
		})

		if (existing_version > SCHEMA_VERSION)
			throw new Error('Your data is from a more recent version of this lib. Please update!')

		let state: State = legacy_state as State // for starter, may actually be true

		if (existing_version < SCHEMA_VERSION) {
			logger.warn(`attempting to migrate schema of ${LIB} from v${existing_version} to v${SCHEMA_VERSION}…`)
			RSEC.fireAnalyticsEvent('schema_migration.began')

			function previous(
				index: number,
				SEC: SoftExecutionContext,
				legacy_state: Readonly<any>,
				hints: Readonly<any>,
			): any {
				const current_step_name = index >= pipeline.length
					? 'not-found'
					: pipeline[index].name || 'unknown'
				return RSEC.xTry('migration step:' + current_step_name, ({ SEC }) => {
					/*if (index > 0) {
						_check_response(_last_SEC, index - 1, 'in')
					}*/

					if (index >= pipeline.length) {
						throw new Error(`No known migration for updating a v${get_schema_version_loose(legacy_state)}!`)
					}

					const legacy_schema_version = get_schema_version_loose(legacy_state)
					//_last_SEC = SEC
					//console.log('_last_SEC now =', SEC.getLogicalStack(), '\n', SEC.getShortLogicalStack())
					logger.trace(`[${LIB}] ⭆ invoking migration pipeline step ${pipeline.length-index}/${pipeline.length} "${current_step_name}"…`, {legacy_state})
					const state = pipeline[index](
						SEC,
						legacy_state,
						hints,
						previous.bind(null, index + 1),
						legacy_schema_version,
						LIBS,
					)
					assert(!!state, 'migration step should return something')
					logger.trace(`[${LIB}] ⭅ returned from migration pipeline step ${pipeline.length-index}/${pipeline.length} "${current_step_name}"…`, {state})
					//_check_response(SEC, index, 'out')
					return state
				})
			}

			// launch the chain
			try {
				state = previous(0, RSEC, state, hints)
			}
			catch (err) {
				logger.error(`failed to migrate schema of ${LIB} from v${existing_version} to v${SCHEMA_VERSION}!`)
				RSEC.fireAnalyticsEvent('schema_migration.failed')
				throw err
			}

			logger.info(`${LIB}: schema migration successful.`, { state })
			RSEC.fireAnalyticsEvent('schema_migration.ended')
		}

		// migrate sub-reducers if any...
		if (is_RootState(state)) {
			state = _migrate_sub_states__root<State>(SEC, state as any /* stupid TS */, sub_states, hints)
		}
		else {
			state = _migrate_sub_states__base<State>(SEC, state, sub_states, hints)
		}

		state = cleanup(SEC, state, hints)

		return state
	})
}

function _migrate_sub_states__root<State /*extends BaseRootState*/>(
	SEC: SoftExecutionContext,
	state: Readonly<State>,
	sub_states: SubStatesMigrations,
	hints: any,
): State {
	let has_change = false
	let { u_state, t_state } = state as any as AnyRootState

	const sub_states_found = new Set<string>()
	const sub_u_states_found = new Set<string>()
	const sub_t_states_found = new Set<string>()

	for (let key in u_state) {
		if (is_UState(u_state[key])) {
			sub_states_found.add(key)
			sub_u_states_found.add(key)
		}
	}
	for (let key in t_state) {
		if (is_TState(t_state[key])) {
			sub_states_found.add(key)
			sub_t_states_found.add(key)
		}
	}

	const sub_states_migrated = new Set<string>()
	Object.keys(sub_states).forEach(key => {
		const migrate_sub_to_latest = sub_states[key]
		const sub_hints = hints[key]
		const previous_sub_ustate = u_state[key]
		const previous_sub_tstate = t_state[key]
		let new_sub_ustate = previous_sub_ustate
		let new_sub_tstate = previous_sub_tstate

		if (sub_u_states_found.has(key) && sub_t_states_found.has(key)) {
			// combo
			[new_sub_ustate, new_sub_tstate] = migrate_sub_to_latest(
					SEC,
					[ previous_sub_ustate, previous_sub_tstate],
					sub_hints,
				)
		}
		else if (sub_u_states_found.has(key)) {
			new_sub_ustate = migrate_sub_to_latest(
					SEC,
					previous_sub_ustate,
					sub_hints,
				)
		}
		else if (sub_t_states_found.has(key)) {
			new_sub_tstate = migrate_sub_to_latest(
					SEC,
					previous_sub_tstate,
					sub_hints,
				)
		}
		else {
			throw new Error(`Expected sub-state "${key}" was not found!`)
		}

		if (previous_sub_ustate && new_sub_ustate !== previous_sub_ustate) {
			has_change = true
			u_state = {
				...u_state,
				[key]: new_sub_ustate,
			}
		}
		if (previous_sub_tstate && new_sub_tstate !== previous_sub_tstate) {
			has_change = true
			t_state = {
				...t_state,
				[key]: new_sub_tstate,
			}
		}

		sub_states_migrated.add(key)
	})

	return {
		...state,
		u_state,
		t_state,
	}
}

function _migrate_sub_states__base<State /*extends BaseState*/>(
	SEC: SoftExecutionContext,
	state: Readonly<State>,
	sub_states: SubStatesMigrations,
	hints: any,
): State {
	for (let k in sub_states) {
		throw new Error('_migrate_sub_states__base() NIMP!')
	}
	return state
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
