import { Component } from 'react'
import PropTypes from 'prop-types'

import { UStateListenerAndProvider } from '../../../context'
import get_game_instance from '../../../services/game-instance-browser'

import View from './component'


class InventoryPanel extends Component {
	static propTypes = {
	}

	render_view = ({ u_state }) => {
		const inventory = get_game_instance().queries.get_sub_state('inventory')
		const wallet = get_game_instance().queries.get_sub_state('wallet')

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
