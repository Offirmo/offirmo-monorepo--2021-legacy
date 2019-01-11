import React, { Component } from 'react'
import { withRouter } from 'react-router'

import Savegame1 from './component'
import { LS_KEYS } from '../../../services/consts'
import { ROUTES } from '../../../services/routes'


class Savegame2 extends Component {
	navigate_home = () => {
		this.props.history.push(ROUTES.home)
	}

	render() {
		return <Savegame1 ls_key={LS_KEYS.savegame} navigate_home={this.navigate_home} />
	}
}

const Savegame3 = withRouter(Savegame2)

export default Savegame3
