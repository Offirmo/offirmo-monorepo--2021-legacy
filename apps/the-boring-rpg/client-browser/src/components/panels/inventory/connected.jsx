import React from 'react'
import PropTypes from 'prop-types'

import { UStateListenerAndProvider } from '../../../context'
import get_game_instance from '../../../services/game-instance-browser'

import View from './component'


class InventoryPanel extends Component {
	render_view = () => {
		const { u_state: { inventory, wallet } } = get_game_instance().model.get_state()

		return (
			<View inventory={inventory} wallet={wallet} />
		)
	}

	render() {
		return (
			<UStateListenerAndProvider render={this.render_view} />
		)
	}
}

export default InventoryPanel
