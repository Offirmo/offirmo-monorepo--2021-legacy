import React, { Fragment } from 'react'

const tbrpg = require('@oh-my-rpg/state-the-boring-rpg')
import { render_adventure, render_character_sheet, render_full_inventory, render_item_short } from '@oh-my-rpg/view-rich-text'

import { Short, Detailed } from '../../misc/interactive-element'
import rich_text_to_react from '../../../services/rich-text-to-react'
import { render_meta } from '../../panels/meta/component'
import './index.css'

export default function Dev({game_instance}) {
	const state = game_instance.get_latest_state()
	const client_state = game_instance.get_client_state()
	let tip_doc = tbrpg.get_tip(state)

	const interactive_items = [
		...Object.values(state.inventory.slotted),
		...state.inventory.unslotted,
	]

	return (
		<div className="dev-page">
			<h1>Dev area</h1>
			<hr key="recap" />
			{rich_text_to_react(tbrpg.get_recap(state))}
			<hr key="last_adventure" />
			{rich_text_to_react(render_adventure(state.last_adventure))}
			<hr key="tip" />
			{tip_doc ? rich_text_to_react(tip_doc) : "(no tip ATM)"}
			<hr key="avatar" />
			{rich_text_to_react(render_character_sheet(state.avatar))}
			<hr key="inventory" />
			{rich_text_to_react(render_full_inventory(state.inventory, state.wallet))}
			<hr key="meta" />
			{rich_text_to_react(render_meta(state, client_state))}
			<hr key="items" />
			<h3>Interactive items:</h3>
			<h4>interactive (auto)</h4>
			{interactive_items.map(i => rich_text_to_react(render_item_short(i)))}
			<h4>short</h4>
			{interactive_items.map(i => <Short UUID={i.uuid} />)}
			<h4>detailed</h4>
			{interactive_items.map(i => <Detailed UUID={i.uuid} />)}
		</div>
	)
}
