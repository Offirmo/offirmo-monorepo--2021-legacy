import React, { Component } from 'react'
import { withRouter } from 'react-router'

import { UStateListenerAndProvider } from '../../../context'
import {ROUTES} from "../../../services/routes";

import View from './component'


class MetaPanelC1 extends Component {

	navigate_to_savegame_editor = () => {
		const { history } = this.props
		history.push(ROUTES.savegame)
	}

	render_view = (u_state) => {
		return (
			<View
				u_state={u_state}
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
