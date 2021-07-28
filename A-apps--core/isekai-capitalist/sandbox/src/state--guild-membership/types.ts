import { BaseState } from '@offirmo-private/state-utils'

import { SSRRank } from '../type--SSR-rank'

export interface State extends BaseState {
	quest_count: number
	rank: SSRRank | null
}
