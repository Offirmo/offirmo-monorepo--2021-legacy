import { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import get_game_instance from '../../../services/game-instance-browser'
import { UStateListenerAndProvider } from '../../../context'
import View from './component'



class Connected extends Component {
	static propTypes = {
		onClick: PropTypes.func.isRequired,
	}

	render_view = ({ u_state }) => {
		const { onClick } = this.props
		const avatar = get_game_instance().queries.get_sub_state('avatar')
		return (
			<View
				onClick={onClick}
				name={avatar.name}
				klass={avatar.klass}
				level={avatar.attributes.level}
			/>)
	}

	render() {
		return (
			<UStateListenerAndProvider render={this.render_view} />
		)
	}
}

export default Connected
