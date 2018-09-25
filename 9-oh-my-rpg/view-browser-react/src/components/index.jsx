import React, { Component } from 'react'

import BurgerMenuWrapper from './burger-menu-wrapper'
import OMR from './omr'
import OhMyRPGUIContextProvider from './state-context'

import './index.css'

export class OhMyRpgUI extends Component {
	// TODO listen to errors and suggest a refresh?

	render() {
		return (
			<OhMyRPGUIContextProvider>
				<BurgerMenuWrapper
					logo={this.props.logo}
					burgerPanelContent={this.props.burgerPanelContent}
					mainContent={<OMR {...this.props} />}
				/>
			</OhMyRPGUIContextProvider>
		)
	}
}

export default OhMyRpgUI
