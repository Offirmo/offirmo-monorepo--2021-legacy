import { Immutable } from '@offirmo-private/ts-types'

import { State } from '../types'
import { Action } from './types'

/////////////////////

export function reduce_action(state: Immutable<State>, action: Immutable<Action>): Immutable<State> {
	throw new Error('NIMP!')
}
