import { BaseState, ElementType } from './types'

interface State extends BaseState {
	wiki: null // TODO

	achievements: { [key: string]: ElementType }

	statistics: {
		bad_play_count: number
		encountered_monsters: { [key: string]: true }
	}
}

const state: State = {
	schema_version: 0,
	revision: 0,

	wiki: null,

	achievements: { foo: ElementType.item },

	statistics: {
		bad_play_count: 0,
		encountered_monsters: { foo: true },
	},

	//foo: 'bar',
	//bar: new Date(),
}
