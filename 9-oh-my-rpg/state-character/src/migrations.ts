import { SCHEMA_VERSION } from './consts'
import { State } from './types'
import { create, OLDEST_LEGACY_STATE_FOR_TESTS } from './state'
import { SoftExecutionContext, SECContext, get_SEC } from './sec'

/////////////////////

function migrate_to_latest(SEC: SoftExecutionContext, legacy_state: any, hints: any = {}): State {
	return get_SEC(SEC).xTry('migrate_to_latest', ({SEC, logger}: SECContext) => {
		const src_version = (legacy_state && legacy_state.schema_version) || 0

		let state: State = create(SEC)

		if (Object.keys(legacy_state).length === 0) {
			// = empty object
			// It happen with some deserialization techniques.
			// It's a new state, keep freshly created one.
		}
		else if (src_version === SCHEMA_VERSION)
			state = legacy_state as State
		else if (src_version > SCHEMA_VERSION)
			throw new Error(`Your data is from a more recent version of this lib. Please update!`)
		else {
			try {
				// TODO report upwards
				logger.warn(`attempting to migrate schema from v${src_version} to v${SCHEMA_VERSION}:`)
				state = migrate_to_2(SEC, legacy_state, hints)
				logger.info(`schema migration successful.`)
			}
			catch (err) {
				// failed, reset all
				// TODO send event upwards
				logger.error(`failed migrating schema, performing full reset !`, err)
				state = create(SEC)
			}
		}

		// migrate sub-reducers if any...

		return state
	})
}

/////////////////////

function migrate_to_2(SEC: SoftExecutionContext, legacy_state: any, hints: any): State {
	return SEC.xTry('migrate_to_2', ({SEC, logger}: SECContext) => {
		if (legacy_state.schema_version !== 1)
			legacy_state = migrate_to_1(SEC, legacy_state, hints)

		logger.info(`migrating schema from v1 to v2...`)
		return {
			...legacy_state,
			schema_version: 2,
			revision: (hints && hints.to_v2 && hints.to_v2.revision) || 0, // added
		}
	})
}

/////////////////////

function migrate_to_1(SEC: SoftExecutionContext, legacy_state: any, hints: any): any {
	return SEC.xTry('migrate_to_1', ({logger}: SECContext) => {
		if (  Object.keys(legacy_state).length !== Object.keys(OLDEST_LEGACY_STATE_FOR_TESTS).length
			|| !legacy_state.hasOwnProperty('characteristics'))
			throw new Error(`Unrecognized schema, most likely too old, can't migrate!`)

		logger.info(`migrating schema from v0/non-versioned to v1...`)

		const {name, klass, characteristics} = legacy_state
		return {
			name,
			klass,
			attributes: characteristics, //< renamed
			schema_version: 1, // added
		}
	})
}

/////////////////////

export {
	migrate_to_latest,
}
