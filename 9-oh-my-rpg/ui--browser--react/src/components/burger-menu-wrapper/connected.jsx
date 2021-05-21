import { Component } from 'react'

import { OhMyRPGUIContext } from '../state-context'
import View from './component'


function BurgerMenuWrapper({mainContent, logo, burgerPanelContent}) {
	//console.log('🔄 [OMR]BurgerMenuWrapper')

	return (
		<OhMyRPGUIContext.Consumer>
			{({isBurgerMenuOpen, onUpdateBurgerMenu}) => {
				const props = {
					mainContent,
					logo,
					burgerPanelContent,
					isBurgerMenuOpen,
					onUpdateBurgerMenu,
				}
				return (
					<View {...props} />
				)
			}}
		</OhMyRPGUIContext.Consumer>
	)
}

export default BurgerMenuWrapper
