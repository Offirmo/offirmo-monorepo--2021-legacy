import { Immutable } from '@offirmo-private/ts-types'
import * as RichText from '@offirmo-private/rich-text-format'

import { get_class__quality } from '../type--quality/selectors--rich-text'
import { SSRRank } from './types'
import { get_corresponding_quality } from './selectors'
import { Quality } from '../type--quality/types'


function _get_decorator(ssr_rank: SSRRank): [ string, string ] {
	return ({
		[SSRRank.F]:   ['',''],
		[SSRRank.E]:   ['',''],
		[SSRRank.D]:   ['',''],
		[SSRRank.C]:   ['',''],
		[SSRRank.B]:   ['',''],
		[SSRRank.A]:   ['',''],
		[SSRRank.S]:   ['⪦', '⪧'],
		[SSRRank.SS]:  ['⟢', '⟣'],
		[SSRRank.SSR]: ['⫎','⫍'],
	} as {[rank: string]: [string, string]})[ssr_rank]
}

interface RenderOptions {
	label_for_none: string
}
const DEFAULT_RENDER_OPTIONS: Immutable<RenderOptions> = {
	label_for_none: 'unknown',
}
export function render(ssr_rank: Immutable<SSRRank> | null, options?: Immutable<RenderOptions>): RichText.Document {
	options = {
		...DEFAULT_RENDER_OPTIONS,
		...options,
	}

	const $doc = RichText.inline_fragment()

	if (!ssr_rank) {
		$doc.addClass('rank--ssr', get_class__quality(Quality.poor))
		$doc.pushText(options.label_for_none)
	}
	else {
		const corresponding_quality = get_corresponding_quality(ssr_rank)
		const [ decorator_pre, decorator_post ] = _get_decorator(ssr_rank)
		$doc.addClass('rank--ssr', get_class__quality(corresponding_quality))
		$doc.pushText([decorator_pre, ssr_rank, decorator_post].join(''))
	}

	return $doc.done()
}
