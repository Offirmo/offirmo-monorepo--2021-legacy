import React, { Component } from 'react'
import { withRouter } from 'react-router'

import View from './component'

import get_game_instance from '../../../services/game-instance-browser'
import {ROUTES} from "../../../services/routes";


class MetaPanelC1 extends Component {
	navigate_to_savegame_editor = () => {
		const { history } = this.props
		history.push(ROUTES.savegame)
	}

	render() {
		return <View
			u_state={get_game_instance().model.get_state().u_state}
			navigate_to_savegame_editor={this.navigate_to_savegame_editor}
		/>
	}
}
const MetaPanelC2 = withRouter(MetaPanelC1)


export default MetaPanelC2
