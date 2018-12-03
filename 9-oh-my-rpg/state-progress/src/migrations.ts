import deepFreeze from 'deep-freeze-strict'

import { LIB, SCHEMA_VERSION } from './consts'
import { State } from './types'
import { SoftExecutionContext, OMRContext, get_lib_SEC } from './sec'

// some hints may be needed to migrate to demo state
// need to export them for composing tests
const MIGRATION_HINTS_FOR_TESTS: any = deepFreeze({
})

/////////////////////

function migrate_to_latest(SEC: SoftExecutionContext, legacy_state: Readonly<any>, hints: Readonly<any> = {}): State {
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

		if (existing_version < SCHEMA_VERSION) {
			logger.warn(`${LIB}: attempting to migrate schema from v${existing_version} to v${SCHEMA_VERSION}:`)
			SEC.fireAnalyticsEvent('schema_migration.began')

			try {
				state = migrate_to_2(SEC, legacy_state, hints)
			}
			catch (err) {
				SEC.fireAnalyticsEvent('schema_migration.failed')
				throw err
			}

			logger.info(`${LIB}: schema migration successful.`)
			SEC.fireAnalyticsEvent('schema_migration.ended')
		}

		// migrate sub-reducers if any...

		return state
	})
}

/////////////////////

function migrate_to_2(SEC: SoftExecutionContext, legacy_state: Readonly<any>, hints: Readonly<any>): State {
	return {
		...legacy_state,
		schema_version: 2,
		achievements: legacy_state.achievements || {}
	} as State
}

/////////////////////

export {
	migrate_to_latest,
	MIGRATION_HINTS_FOR_TESTS,
}
