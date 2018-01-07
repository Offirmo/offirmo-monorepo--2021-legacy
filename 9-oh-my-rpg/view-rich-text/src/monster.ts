import { MonsterRank, Monster } from '@oh-my-rpg/logic-monsters'

import * as RichText from '@oh-my-rpg/rich-text-format'

function render_monster(m: Monster): RichText.Document {
	const $doc = RichText.span()
		.addClass('monster', 'monster--rank--' + m.rank)
		.pushText('{{level}} {{rank}} {{name||Capitalize}}')
		.pushRawNode(
			RichText.span().pushText('L') .pushText('' + m.level).done(),
			'level',
		)
		.pushRawNode(
			RichText.span().addClass('rank--' + m.rank).pushText(m.rank).done(),
			'rank',
		)
		.pushRawNode(
			RichText.span().addClass('monster__name').pushText(m.name).done(),
			'name',
		)
		.done()

	$doc.$hints.possible_emoji = m.possible_emoji

	return $doc
}

export {
	render_monster,
}
