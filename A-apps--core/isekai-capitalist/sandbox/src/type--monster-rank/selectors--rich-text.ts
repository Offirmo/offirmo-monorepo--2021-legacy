import { Immutable } from '@offirmo-private/ts-types'
import * as RichText from '@offirmo-private/rich-text-format'

/*
import { get_class__quality } from '../type--quality/selectors--rich-text'
import { SSRRank } from './types'
import { get_corresponding_quality } from './selectors'


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


export function render_ssr_rank(ssr_rank: Immutable<SSRRank>, options?: {}): RichText.Document {
	const corresponding_quality = get_corresponding_quality(ssr_rank)
	const [ decorator_pre, decorator_post ] = _get_decorator(ssr_rank)

	const $doc = RichText.inline_fragment()
		.addClass('rank--ssr', get_class__quality(corresponding_quality))
		.pushText([decorator_pre, ssr_rank, decorator_post].join(''))
		.done()

	return $doc
}
*/
