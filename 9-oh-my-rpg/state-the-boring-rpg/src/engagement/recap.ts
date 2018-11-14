import * as RichText from '@offirmo/rich-text-format'

import { State } from '../types'

function get_recap(state: Readonly<State>): RichText.Document {
	const isNewGame = (state.revision === 0)
	if (isNewGame) {
		return RichText.inline_fragment()
			.pushText('You are an ')
			.pushStrong('otherworlder')
			.pushText(', an adventurer from another world…{{br}}')
			.pushText('Congratulations, you were chosen to enter the unknown realm of ')
			.pushStrong('Jaema')
			.pushText('!{{br}}')
			.pushText('Maybe were you just more courageous, cunning and curious than your peers?{{br}}')
			.pushText('But for now, let’s go on an adventure, for glory ⚔ and loot 📦 💰 !')
			.done()
	}

	return RichText.block_fragment()
		.pushText('You are ')
		.pushInlineFragment(state.avatar.name, {
			id: 'name',
			classes: [ 'avatar__name'],
		})
		.pushText(', the ')
		.pushInlineFragment(state.avatar.klass, {
			id: 'class',
			classes: ['avatar__class'],
		})
		.pushText(' from another world.{{br}}')
		.pushText('You are adventuring in the mysterious world of ')
		.pushStrong('Jaema')
		.pushText('…{{br}}')
		.pushStrong('For glory ⚔  and loot 📦 💰 !')
		.done()
}

export {
	get_recap,
}
