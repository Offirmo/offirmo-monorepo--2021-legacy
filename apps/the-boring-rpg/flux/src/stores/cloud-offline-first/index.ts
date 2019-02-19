import memoize_one from 'memoize-one'

import { State } from '@tbrpg/state'
import * as TBRPGState from '@tbrpg/state'
import * as PRNGState from '@oh-my-rpg/state-prng'

import { LIB } from '../../consts'
import { SoftExecutionContext } from '../../sec'
import { Action } from '../../actions'
import { reduce_action } from '../../utils/reduce-action'
import { Store } from '../types'


function create(
	SEC: SoftExecutionContext,
	set: (state: Readonly<State>) => void
): Store {
	return SEC.xTry(`creating ${LIB} offline-first cloud store`, ({SEC, logger}: any) => {
		const pending_actions = []

		function sync() {

		}

		function dispatch(action: Readonly<Action>): void {
			pending_actions.push(action)
		}

		return {
			dispatch,
			get: () => {
				throw new Error('NIMP')
			},
		}
	})
}

export {
	Store,
	create,
}
