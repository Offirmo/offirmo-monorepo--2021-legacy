import React from 'react'

import { render_full_inventory } from '@oh-my-rpg/view-rich-text'

import { rich_text_to_react } from '../../../utils/rich_text_to_react'



function Inventory({workspace}) {
	const { state } = workspace
	const doc = render_full_inventory(state.inventory, state.wallet)

	return (
		<div>
			{rich_text_to_react(doc)}
		</div>
	)
}

export {
	Inventory,
}
