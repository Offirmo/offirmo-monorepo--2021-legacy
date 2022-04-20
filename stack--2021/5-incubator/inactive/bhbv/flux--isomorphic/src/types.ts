import { Immutable } from '@offirmo-private/ts-types'

import { State } from '@bhbv/state--isomorphic'


interface AppFlux<ViewState> {

	view: {
		get: () => Immutable<ViewState>
		set_state: (fn: (state: ViewState) => Partial<ViewState>) => void
		subscribe: (id: string, fn: () => void) => () => void
	}

	model: {
		get: () => Immutable<State>

		dispatch: (/* TODO action */) => void

		selectors: {
			// TODO
		}
	}
}
