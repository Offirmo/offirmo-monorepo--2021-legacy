/////////////////////

import { LIB, SCHEMA_VERSION } from './consts'
import { State } from './types'

/////////////////////

function migrate_to_latest(legacy_state: any, hints: any = {}): State {
	const existing_version = (legacy_state && legacy_state.schema_version) || 0

	if (existing_version > SCHEMA_VERSION)
		throw new Error(`${LIB}: Your data is from a more recent version of this lib. Please update!`)

	let state: State = legacy_state as State // for starter

	if (existing_version < SCHEMA_VERSION) {
		console.warn(`${LIB}: attempting to migrate schema from v${existing_version} to v${SCHEMA_VERSION}:`)

		state = migrate_to_2(legacy_state, hints)

		console.info(`${LIB}: schema migration successful.`)
	}

	// migrate sub-reducers if any...

	return state
}

/////////////////////

function migrate_to_2(legacy_state: any, hints: any): any {
	throw new Error('Unrecognized schema, most likely too old, can\'t migrate!')
}

/////////////////////

export {
	migrate_to_latest,
}
