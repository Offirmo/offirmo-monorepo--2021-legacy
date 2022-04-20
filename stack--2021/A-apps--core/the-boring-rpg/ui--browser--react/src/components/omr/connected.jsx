import { Component } from 'react'

import { OhMyRPGUIContext } from '../state-context'

import View from './component'
import './index.css'


function Main({children, logo, universeAnchor, bottomMenuItems, bottomMarkerIndex, aboutContent}) {
	//console.log('🔄 [OMR]Main')

	return (
		<OhMyRPGUIContext.Consumer>
			{({openBurgerMenu, isAboutOpen, toggleAbout, _registerNotificationSystem}) => {
				const props = {
					children, logo, universeAnchor, bottomMenuItems, aboutContent,
					openBurgerMenu, isAboutOpen, toggleAbout, _registerNotificationSystem,
				}

				const css_selected_bottom_menu_value = -bottomMenuItems.length + 1 + ((bottomMarkerIndex >= 0) ? bottomMarkerIndex : -1)
				document.documentElement.style.setProperty(
					'--omr⋄ui__bottom-menu--selected-reverse-index',
					css_selected_bottom_menu_value,
				)

				return (
					<View {...props} />
				)
			}}
		</OhMyRPGUIContext.Consumer>
	)
}
Main.defaultProps = {
	logo: <span>[Game name/logo here]</span>,
	immersionSlides: [],
	bottomMenuItems: [],
	aboutContent: <span>This game was made by [x]...</span>,
	burgerPanelContent: <span>put some settings here</span>,
}

export default Main
