import { Immutable } from '@offirmo-private/ts-types'

import { SharedMemoryType, State } from './types'



export function get_emoji_for_memory_type(type: SharedMemoryType): string {
	switch (type) {
		case SharedMemoryType.life_pleasure:
			return '🍰'
		case SharedMemoryType.victory:
			return '⚔️'
		case SharedMemoryType.celebration:
			return '🍻'
		case SharedMemoryType.growth:
			return '🎓'
		case SharedMemoryType.intimacy:
			return '💗'
		case SharedMemoryType.assistance:
			return '🤝'
		case SharedMemoryType.adventure:
			return '⚜️'
		default:
			throw new Error(`get_emoji_for_memory_type() unknown type "${type}"!`)
	}
}
// 🤝🧝‍♀️🧙‍♂️🧙🏻🧙🏻‍♀️🥾☀️🍽⛰🎊🎉⚜️
