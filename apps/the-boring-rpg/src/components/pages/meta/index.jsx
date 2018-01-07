import React from 'react'

import { render_account_info } from '@oh-my-rpg/view-rich-text'

import { rich_text_to_react } from '../../../utils/rich_text_to_react'


function Meta({workspace}) {
	const { state } = workspace

	const doc = render_account_info(state.meta)

	return (
		<div>
			{rich_text_to_react(doc)}
		</div>
	)
}

export {
	Meta,
}
