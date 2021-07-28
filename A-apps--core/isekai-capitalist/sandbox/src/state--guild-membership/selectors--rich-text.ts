import { Immutable } from '@offirmo-private/ts-types'
import * as RichText from '@offirmo-private/rich-text-format'

import { render as render_ssr_rank } from '../type--SSR-rank/selectors--rich-text'
import { State } from './types'
import { get_corresponding_quality, SSRRank } from '../type--SSR-rank'
import { get_class__quality } from '../type--quality/selectors--rich-text'
/*import {
} from './selectors'*/


export interface Options {
	mode: 'simple' | 'detailed'
}
export function render(state: Immutable<State>, options: Immutable<Options> = { mode: 'simple' }): RichText.Document {
	const $rank = render_ssr_rank(state.rank, { label_for_none: 'not registered'})

	if (options.mode === 'simple') {
		return RichText.inline_fragment()
			.pushText('Adventurers’ Guild rank: ')
			.pushNode($rank)
			.done()
	}

	const $doc = RichText.unordered_list()
		.pushKeyValue('Rank', $rank)
		.done()

	return $doc
}
