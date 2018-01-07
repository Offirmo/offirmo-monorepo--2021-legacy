import React from 'react'

import { render_character_sheet } from '@oh-my-rpg/view-rich-text'

import { rich_text_to_react } from '../../../utils/rich_text_to_react'



function CharacterSheet({workspace}) {
	const { state } = workspace
	const doc = render_character_sheet(state.avatar)

	return (
		<div>
			{rich_text_to_react(doc)}
		</div>
	)
}

export {
	CharacterSheet,
}
