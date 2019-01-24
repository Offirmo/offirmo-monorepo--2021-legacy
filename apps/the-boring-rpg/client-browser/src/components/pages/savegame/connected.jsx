import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

import View from './component'
import { LS_KEYS } from '../../../services/consts'
import { ROUTES } from '../../../services/routes'


class PageSavegameEditorC1 extends Component {
	navigate_home = () => {
		this.props.history.push(ROUTES.home)
	}

	render() {
		return <View ls_key={LS_KEYS.savegame} navigate_home={this.navigate_home} />
	}
}

const PageSavegameEditorC2 = withRouter(PageSavegameEditorC1)

export default PageSavegameEditorC2
