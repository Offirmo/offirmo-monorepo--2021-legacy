import { Immutable } from '@offirmo-private/ts-types'

import { State } from './types'


export function create(): Immutable<State> {
	return {
		schema_version: 0,
		revision: 0,
	}
}
