import { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

import { UStateListenerAndProvider } from '../../../context'
import { ROUTES } from '../../../services/routes'

import View from './component'
import get_game_instance from '../../../services/game-instance-browser'


class MetaPanelC1 extends Component {
	static propTypes = {
		history: PropTypes.object.isRequired,
	}

	navigate_to_savegame_editor = () => {
		const { history } = this.props
		history.push(ROUTES.savegame)
	}

	render_view = ({ u_state }) => {
		//console.log('🔄 MetaPanelC1.render_view')
		const { statistics } = get_game_instance().queries.get_sub_state('progress')

		return (
			<View
				statistics={statistics}
				navigate_to_savegame_editor={this.navigate_to_savegame_editor}
			/>
		)
	}

	render() {
		return (
			<UStateListenerAndProvider render={this.render_view} />
		)
	}
}
const MetaPanelC2 = withRouter(MetaPanelC1)


export default MetaPanelC2
