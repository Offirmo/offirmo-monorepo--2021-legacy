import { Component } from 'react'
import PropTypes from 'prop-types'

import { UStateListenerAndProvider } from '../../../context'
import get_game_instance from '../../../services/game-instance-browser'

import View from './component'


class CharacterPanel extends Component {
	static propTypes = {
	}

	render_view = ({ u_state }) => {
		const avatar = get_game_instance().queries.get_sub_state('avatar')

		return (
			<View avatar={avatar} />
		)
	}

	render() {
		return (
			<UStateListenerAndProvider render={this.render_view} />
		)
	}
}

export default CharacterPanel
