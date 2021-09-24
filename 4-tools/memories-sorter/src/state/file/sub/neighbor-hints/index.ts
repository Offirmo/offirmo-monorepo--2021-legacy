export * from './types'
export * from './selectors'

import { NeighborHints } from './types'

export function create(): NeighborHints {
	// safest possible
	throw new Error('NIMP!')
}

export function _create_ut(): NeighborHints {
	throw new Error('NIMP!')
}
