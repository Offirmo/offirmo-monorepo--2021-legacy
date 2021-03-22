import { State } from '../types'
import { SCHEMA_VERSION } from '../consts'


export function create(): State {
	return {
		schema_version: SCHEMA_VERSION,

		revision: 0,

		stories: [],
	}
}
