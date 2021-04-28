import { Component } from 'react'

import BurgerMenuWrapper from './burger-menu-wrapper'
import OMR from './omr'
import OhMyRPGUIContextProvider, { OhMyRPGUIContext } from './state-context'

import './index.css'

class OhMyRpgUI extends Component {
	// TODO listen to errors and suggest a refresh?

	render() {
		if (window.oᐧextra.flagꓽdebug_render) console.log('🔄 [OMR]Root')

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

export {
	OhMyRpgUI,
	OhMyRPGUIContext,
}
