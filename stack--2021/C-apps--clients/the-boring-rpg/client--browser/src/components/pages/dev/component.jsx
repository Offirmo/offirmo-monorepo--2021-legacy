import * as React from 'react'

import { render_adventure, render_character_sheet, render_full_inventory, render_item_short } from '@oh-my-rpg/view-rich-text'

import { Short, Detailed } from '../../misc/interactive-element'
import rich_text_to_react from '../../../services/rich-text-to-react'
import get_game_instance from '../../../services/game-instance-browser'
import { render_meta } from '../../panels/meta/component'
import './index.css'

const PageDevViewM = React.memo(
	function PageDevView({state, view_state}) {
		if (window.oᐧextra.flagꓽdebug_render) console.log('🔄 PageDevView')

		const inventory = get_game_instance().queries.get_sub_state('inventory')
		const interactive_items = [
			...Object.values(inventory.slotted),
			...inventory.unslotted,
		]

		return (
			<div className="dev-page">
				<h1>Dev area</h1>
				<hr key="recap" />
				{rich_text_to_react(get_game_instance().queries.get_recap())}
				<hr key="last_adventure" />
				{rich_text_to_react(render_adventure(get_game_instance().queries.get_last_adventure()))}
				<hr key="pending" />
				{/* ... */}
				<hr key="avatar" />
				{rich_text_to_react(render_character_sheet(get_game_instance().queries.get_sub_state('avatar')))}
				<hr key="inventory" />
				{rich_text_to_react(render_full_inventory(inventory, get_game_instance().queries.get_sub_state('wallet')))}
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
	},
)

export default PageDevViewM
