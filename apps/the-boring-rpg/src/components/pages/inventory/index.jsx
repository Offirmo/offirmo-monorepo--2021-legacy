import React from 'react'

import { render_full_inventory } from '@oh-my-rpg/view-rich-text'

import { Chat } from '../../templates/chat-interface'
import { with_game_instance } from '../../context/game-instance-provider'
import { rich_text_to_react } from '../../../utils/rich_text_to_react'


class InventoryBase extends React.Component {

	componentWillMount () {
		console.info('~~ InventoryBase componentWillMount')
		this.props.instance.set_client_state(client_state => ({
			mode: 'inventory',
		}))
	}

	render() {
		const { instance } = this.props
		const state = instance.get_latest_state()

		const doc = render_full_inventory(state.inventory, state.wallet)

		return (
			<div className={'page page--inventory'}>
				{rich_text_to_react(doc)}
			</div>
		)
	}
}

const Inventory = with_game_instance(InventoryBase)

export {
	Inventory,
}
