import { Immutable } from '@offirmo-private/ts-types'
import * as RichText from '@offirmo-private/rich-text-format'

import { render as render_relationship_level } from '../type--relationship-level'
import { State } from './types'
/*import {
} from './selectors'*/


export interface Options {
	mode: 'simple' | 'detailed'
}
export function render(state: Immutable<State>, options: Immutable<Options> = { mode: 'detailed' }): RichText.Document {
	if (options.mode === 'simple') {
		return RichText.inline_fragment()
			.pushText('TODO')
			.done()
	}

	const $doc = RichText.unordered_list()
		.pushKeyValue('Relationship level', render_relationship_level(state.level))
		.pushKeyValue('Shared memories', `${state.memories.count}` + (state.memories.count ? ` (${Array.from(state.memories.recent_pipeline).join(' ')}…)` : ''))
		.done()

	return $doc
}
