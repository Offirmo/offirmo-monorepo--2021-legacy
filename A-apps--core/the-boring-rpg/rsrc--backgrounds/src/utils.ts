import * as RichText from '@offirmo-private/rich-text-format'

import { Background } from './types'


function render_artwork_legend(artwork: Readonly<Background>): RichText.Document {
	const { author, source, display_name, keywords, position_pct } = artwork

	const artwork_name = RichText.inline_fragment()
		.pushText('« ')
		.pushText(
			display_name.endsWith('Ii')
				? display_name.slice(0, -1) + 'I'
				: display_name,
		)
		.pushText(' »')
		.addHints({
			href: source,
		})
		.done()

	const author_name = RichText.inline_fragment()
		.pushText(author.display_name)
		.addHints({
			href: author.url,
		})
		.done()

	const builder = RichText.inline_fragment()
		.pushNode(artwork_name)
		.pushLineBreak()
		.pushText(' by ')
		.pushNode(author_name)

	let has_errors = false
	const errors = RichText.inline_fragment()
	if (source.length < 12) {
		has_errors = true
		errors.pushLineBreak().pushText('💥  missing source!')
	}
	if (position_pct.x === 50 && position_pct.y === 50) {
		has_errors = true
		errors.pushLineBreak().pushText('💥  not aligned!')
	}
	if (has_errors)
		builder.pushNode(errors.done())

	return builder.done()
}


export {
	render_artwork_legend,
}
