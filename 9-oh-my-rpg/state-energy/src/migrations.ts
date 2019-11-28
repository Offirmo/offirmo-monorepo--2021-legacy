import deepFreeze from 'deep-freeze-strict'

import { LIB, SCHEMA_VERSION } from './consts'
import { UState, TState } from './types'
import { SoftExecutionContext, OMRContext, get_lib_SEC } from './sec'

// some hints may be needed to migrate to demo state
// need to export them for composing tests
const MIGRATION_HINTS_FOR_TESTS: any = deepFreeze({
})

/////////////////////

function migrate_to_latest(
	SEC: SoftExecutionContext,
	[legacy_u_state, legacy_t_state]: [ Readonly<any>, Readonly<any> ],
	hints: Readonly<any> = {},
): [ Readonly<UState>, Readonly<TState> ] {
	const existing_version = (legacy_u_state && legacy_u_state.schema_version) || 0

	SEC = get_lib_SEC(SEC)
		.setAnalyticsAndErrorDetails({
			version_from: existing_version,
			version_to: SCHEMA_VERSION,
		})

	return SEC.xTry('migrate_to_latest', ({SEC, logger}: OMRContext) => {

		if (existing_version > SCHEMA_VERSION)
			throw new Error('Your data is from a more recent version of this lib. Please update!')

		// for starter
		let u_state: UState = legacy_u_state as UState
		let t_state: TState = legacy_t_state as TState

		if (existing_version < SCHEMA_VERSION) {
			logger.warn(`${LIB}: attempting to migrate schema from v${existing_version} to v${SCHEMA_VERSION}:`)
			SEC.fireAnalyticsEvent('schema_migration.began')

			try {
				[ u_state, t_state ] = migrate_to_3(SEC, [ legacy_u_state, legacy_t_state ], hints)
			}
			catch (err) {
				SEC.fireAnalyticsEvent('schema_migration.failed')
				throw err
			}

			logger.info(`${LIB}: schema migration successful.`)
			SEC.fireAnalyticsEvent('schema_migration.ended')
		}

		// migrate sub-reducers if any...

		return [ u_state, t_state ]
	})
}

/////////////////////

function migrate_to_3(
	SEC: SoftExecutionContext,
	[legacy_u_state, legacy_t_state]: [ Readonly<any>, Readonly<any> ],
	hints: Readonly<any>,
): [ Readonly<UState>, Readonly<TState> ] {
	throw new Error('Schema is too old (pre-beta), can’t migrate!')
}

/////////////////////

export {
	migrate_to_latest,
	MIGRATION_HINTS_FOR_TESTS,
}
