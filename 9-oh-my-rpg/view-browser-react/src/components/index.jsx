import React, { Component } from 'react'

import BurgerMenuWrapper from './burger-menu-wrapper'
import Main from './main'
import OhMyRPGUIContextProvider from './state-context'

import './index.css'

export class OhMyRpgUI extends Component {
	// TODO listen to errors and suggest a refresh?

	render() {
		return (
			<OhMyRPGUIContextProvider>
				<BurgerMenuWrapper
					burgerPanelContent={this.props.burgerPanelContent}
					mainContent={<Main {...this.props} />}
				/>
			</OhMyRPGUIContextProvider>
		)
	}
}

export default OhMyRpgUI
