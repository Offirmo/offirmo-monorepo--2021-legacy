import React, { Fragment } from 'react'

import * as tbrpg from '@tbrpg/state'
import { render_adventure, render_character_sheet, render_full_inventory, render_item_short } from '@oh-my-rpg/view-rich-text'

import { Short, Detailed } from '../../misc/interactive-element'
import rich_text_to_react from '../../../services/rich-text-to-react'
import { render_meta } from '../../panels/meta/component'
import './index.css'

const PageDevViewM = React.memo(
	function PageDevView({state, view_state}) {
		console.log('🔄 PageDevView')

		const interactive_items = [
			...Object.values(state.u_state.inventory.slotted),
			...state.u_state.inventory.unslotted,
		]

		return (
			<div className="dev-page">
				<h1>Dev area</h1>
				<hr key="recap" />
				{rich_text_to_react(tbrpg.get_recap(state.u_state)) /* TODO move to state? */}
				<hr key="last_adventure" />
				{rich_text_to_react(render_adventure(state.u_state.last_adventure))}
				<hr key="pending" />
				{/* TODO */}
				<hr key="avatar" />
				{rich_text_to_react(render_character_sheet(state.u_state.avatar))}
				<hr key="inventory" />
				{rich_text_to_react(render_full_inventory(state.u_state.inventory, state.u_state.wallet))}
				<hr key="meta" />
				{rich_text_to_react(render_meta(state, view_state))}
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
)

export default PageDevViewM
