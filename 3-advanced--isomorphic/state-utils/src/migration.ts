import assert from 'tiny-invariant'
import { SoftExecutionContext } from '@offirmo-private/soft-execution-context'
import { Immutable } from '@offirmo-private/ts-types'

import { AnyRootState } from './types--internal'
import { get_schema_version_loose, get_base_loose } from './selectors'
import { is_RootState, has_versioned_schema } from './type-guards'
import { OffirmoState } from './types'


////////////////////////////////////////////////////////////////////////////////////

export interface Libs {
	//deep_freeze: ImmutabilityEnforcer,
}
const LIBS: Libs = {
	//deep_freeze: deep_freeze, // TODO rework
}

const get_state_summary = get_base_loose

export type GenericMigration<State = any, OlderState = any> = (
	SEC: SoftExecutionContext<any, any, any>,
	legacy_state: OlderState, // NOT immutable since we may return it unchanged
	hints: Immutable<any>,
) => State

export type MigrationStep<State = any, OlderState = any> = (
	SEC: SoftExecutionContext<any, any, any>,
	legacy_state: OlderState, // NOT immutable since we may return it unchanged
	hints: Immutable<any>,
	previous: GenericMigration<OlderState>,
	// for convenience:
	legacy_schema_version: number,
	libs: Libs,
) => State

export type LastMigrationStep<State, OlderState = any> = MigrationStep<State, OlderState>

export type CleanupStep<State> = (
	SEC: SoftExecutionContext<any, any, any>,
	state: State, // NOT immutable since we may return it unchanged
	hints: Immutable<any>,
) => State

export type SubStatesMigrations = { [key: string]: GenericMigration }

////////////////////////////////////////////////////////////////////////////////////

export function generic_migrate_to_latest<State>({
	SEC,

	LIB,
	SCHEMA_VERSION,
	legacy_state,
	hints,
	sub_states_migrate_to_latest, // no default to force thinking
	cleanup = (SEC, state, hints) => state,
	pipeline,
}: {
	SEC: SoftExecutionContext
	LIB: string
	SCHEMA_VERSION: number
	legacy_state: any // NOT immutable since we may return it unchanged
	hints: Immutable<any>
	sub_states_migrate_to_latest: SubStatesMigrations
	cleanup?: CleanupStep<State>
	pipeline: Immutable<[
		LastMigrationStep<State>,
		...MigrationStep[],
	]>
}): State {
	return SEC.xTry('migrate_to_latest', ({SEC, logger}) => {
		const existing_version = get_schema_version_loose(legacy_state as OffirmoState)

		const RSEC = SEC
		RSEC.setLogicalStack({ module: LIB })
		RSEC.setAnalyticsAndErrorDetails({
			version_from: existing_version,
			version_to: SCHEMA_VERSION,
		})

		if (existing_version > SCHEMA_VERSION)
			throw new Error('Your data is from a more recent version of this lib. Please update!')

		let state = legacy_state as State // for starter, may actually be true

		if (existing_version < SCHEMA_VERSION) {
			logger.info(`attempting to migrate schema of ${LIB} from v${existing_version} to v${SCHEMA_VERSION}…`)
			RSEC.fireAnalyticsEvent('schema_migration.began')

			function previous(
				index: number,
				SEC: SoftExecutionContext,
				legacy_state: Immutable<any>,
				hints: Immutable<any>,
			): any {
				const migrate_step = pipeline[index]
				const current_step_name = index >= pipeline.length
					? 'not-found'
					: migrate_step?.name || 'unknown'
				return RSEC.xTry('migration step:' + current_step_name, ({ SEC }) => {
					if (index >= pipeline.length) {
						throw new Error(`No known migration for updating a v${get_schema_version_loose(legacy_state)}!`)
					}
					assert(typeof migrate_step === 'function', 'migrate step should be a function!')

					const legacy_schema_version = get_schema_version_loose(legacy_state)
					//_last_SEC = SEC
					//console.log('_last_SEC now =', SEC.getLogicalStack(), '\n', SEC.getShortLogicalStack())
					logger.trace(`[${LIB}] ⭆ invoking migration pipeline step ${pipeline.length-index}/${pipeline.length} "${current_step_name}"…`,
						get_state_summary(legacy_state)
					)
					const state = migrate_step(
						SEC,
						legacy_state,
						hints,
						previous.bind(null, index + 1),
						legacy_schema_version,
						LIBS,
					)
					assert(!!state, 'migration step should return something')
					logger.trace(`[${LIB}] ⭅ returned from migration pipeline step ${pipeline.length-index}/${pipeline.length} "${current_step_name}".`,
						get_state_summary(state)
					)
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

			logger.info(`${LIB}: schema migration successful.`,
				get_state_summary(state as any)
			)
			RSEC.fireAnalyticsEvent('schema_migration.ended')
		}

		// migrate sub-reducers if any...
		if (is_RootState(state as any)) {
			state = _migrate_sub_states__root<State>(SEC, state, sub_states_migrate_to_latest, hints)
		}
		else {
			state = _migrate_sub_states__base<State>(SEC, state, sub_states_migrate_to_latest, hints)
		}

		state = cleanup(SEC, state, hints)

		return state
	})
}

function _migrate_sub_states__root<State /*extends BaseRootState*/>(
	SEC: SoftExecutionContext,
	state: State, // NOT immutable since we may return it unchanged
	sub_states_migrate_to_latest: SubStatesMigrations,
	hints: Immutable<any>,
): State {
	let has_change = false
	let { u_state, t_state } = state as any as AnyRootState

	const unmigrated_sub_states = new Set<string>([...Object.keys(sub_states_migrate_to_latest)])
	const sub_states_found = new Set<string>()
	const sub_u_states_found = new Set<string>()
	const sub_t_states_found = new Set<string>()

	// using base state in case of a legacy state
	for (let key in u_state) {
		if (has_versioned_schema(u_state[key])) {
			sub_states_found.add(key)
			sub_u_states_found.add(key)
		}
	}
	for (let key in t_state) {
		if (has_versioned_schema(t_state[key])) {
			sub_states_found.add(key)
			sub_t_states_found.add(key)
		}
	}

	/*
	console.log({
		sub_states_found,
		sub_u_states_found,
		sub_t_states_found,
	})
	*/

	const sub_states_migrated = new Set<string>()
	sub_states_found.forEach(key => {
		const migrate_sub_to_latest = sub_states_migrate_to_latest[key]
		if (!migrate_sub_to_latest)
			throw new Error(`Found sub-state "${key}" but no migration fn was provided!`)

		const sub_hints = hints[key]
		const previous_sub_ustate = u_state[key]
		const previous_sub_tstate = t_state[key]
		let new_sub_ustate = previous_sub_ustate
		let new_sub_tstate = previous_sub_tstate

		SEC.xTry(`migration of sub-state "${key}"`, ({SEC, logger}) => {

			if (sub_u_states_found.has(key) && sub_t_states_found.has(key)) {
				// combo
				const legacy_sub_state = [ previous_sub_ustate, previous_sub_tstate]
				logger.trace(`⭆ invoking migration fn of bundled sub-state "${key}"…`,
					get_state_summary(legacy_sub_state as any)
				)
				;[new_sub_ustate, new_sub_tstate] = migrate_sub_to_latest(
					SEC,
					legacy_sub_state,
					sub_hints,
				)
			}
			else if (sub_u_states_found.has(key)) {
				logger.trace(`⭆ invoking migration fn of sub-UState "${key}"…`,
					get_state_summary(previous_sub_ustate)
				)
				new_sub_ustate = migrate_sub_to_latest(
					SEC,
					previous_sub_ustate,
					sub_hints,
				)
			}
			else if (sub_t_states_found.has(key)) {
				logger.trace(`⭆ invoking migration fn of sub-TState "${key}"…`,
					get_state_summary(previous_sub_tstate)
				)
				new_sub_tstate = migrate_sub_to_latest(
					SEC,
					previous_sub_tstate,
					sub_hints,
				)
			}
			else {
				throw new Error(`Expected sub-state "${key}" was not found!`)
			}
			logger.trace(`⭅ returned from migration fn of sub-*state "${key}".`)
		})

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
		unmigrated_sub_states.delete(key)
	})

	if (unmigrated_sub_states.size)
		throw new Error(`Specified sub-states not found! ${Array.from(unmigrated_sub_states).join(',')}`)

	if (!has_change)
		return state

	return {
		...state,
		u_state,
		t_state,
	}
}

function _migrate_sub_states__base<State /*extends BaseState*/>(
	SEC: SoftExecutionContext,
	state: State, // NOT immutable since we may return it unchanged
	sub_states_migrate_to_latest: SubStatesMigrations,
	hints: Immutable<any>,
): State {
	//let has_change = false
	const legacy_state: any = state

	for (let key in sub_states_migrate_to_latest) {
		if (has_versioned_schema(legacy_state[key])) {
			throw new Error('_migrate_sub_states__base() NIMP!')
		}
	}

	return state
}
