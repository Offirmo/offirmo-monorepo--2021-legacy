import React from 'react'

import { render_character_sheet } from '@oh-my-rpg/view-rich-text'

import { rich_text_to_react } from '../../../utils/rich_text_to_react'


// TODO context

function CharacterSheet({workspace}) {
	const state = workspace.instance.get_latest_state()
	const doc = render_character_sheet(state.avatar)

	return (
		<div className={'page page--character'}>
			{rich_text_to_react(doc)}
			<hr/>

		</div>
	)
}

export {
	CharacterSheet,
}
