import React from 'react'

import { render_full_inventory } from '@oh-my-rpg/view-rich-text'

import rich_text_to_react from '../../../services/rich-text-to-react'
import './index.css'


export default class Component extends React.Component {
	render() {
		console.log('Inventory is refreshing')
		const { game_instance } = this.props
		const state = game_instance.get_latest_state()

		return (
			<div className={'tbrpg-panel tbrpg-panel--inventory o⋄flex--column'}>
				<div className='panel-top-content o⋄flex-element--nogrow'>
					{rich_text_to_react(render_full_inventory(state.inventory, state.wallet))}
					{ /* <hr/> */ }
				</div>
				<div className='o⋄flex-element--grow o⋄overflow-y⁚auto'>
					{ /*<Chat gen_next_step={this.gen_next_step()} />*/ }
				</div>
			</div>
		)
	}
}
