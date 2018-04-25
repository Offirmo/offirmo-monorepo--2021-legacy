import React from 'react'

import * as RichText from '@offirmo/rich-text-format'
import {
	SCHEMA_VERSION,
	GAME_VERSION,
	URL_OF_PRODUCT_HUNT_PAGE,
	URL_OF_REPO,
	URL_OF_FORK,
	URL_OF_ISSUES,
	URL_OF_REDDIT_PAGE,
} from '@oh-my-rpg/state-the-boring-rpg'
import { render_full_inventory } from '@oh-my-rpg/view-rich-text'

import { Chat } from '../../chat-interface'
import { rich_text_to_react } from '../../../utils/rich_text_to_react'


export default class Component extends React.Component {
	render() {
		console.log('Inventory is refreshing')
		const { game_instance } = this.props
		const state = game_instance.get_latest_state()

		return (
			<div className={'tbrpg-panel o⋄flex-column'}>
				<div className='panel-top-content o⋄flex-element-nogrow'>
					{rich_text_to_react(render_full_inventory(state.inventory, state.wallet))}
					<hr/>
				</div>
				<div className='o⋄flex-element-grow o⋄overflow-y⁚auto'>
					{ /*<Chat gen_next_step={this.gen_next_step()} />*/ }
				</div>
			</div>
		)
	}
}
