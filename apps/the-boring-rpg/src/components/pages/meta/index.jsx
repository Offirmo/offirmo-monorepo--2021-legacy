import React from 'react'

import { render_account_info } from '@oh-my-rpg/view-rich-text'

import { rich_text_to_react } from '../../../utils/rich_text_to_react'

// TODO context

function Meta({workspace}) {
	const state = workspace.instance.get_latest_state()

	const doc = render_account_info(state.meta)

	return (
		<div className={'page page--meta'}>
			{rich_text_to_react(doc)}
		</div>
	)
}

export {
	Meta,
}
