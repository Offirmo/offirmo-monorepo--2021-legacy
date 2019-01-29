import React, { Component } from 'react'
import memoize_one from 'memoize-one'

import BurgerMenu from 'react-burger-menu/lib/menus/scaleDown'
import ErrorBoundary from '@offirmo/react-error-boundary'
import { OhMyRPGUIContext } from '../state-context'

import View from './component'

import './index.css'

// technical elements needed by burger-menu scale down
// https://github.com/negomi/react-burger-menu#properties
const PAGE_WRAP_ID = 'oh-my-rpg-ui__page-wrap'
const OUTER_CONTAINER_ID = 'oh-my-rpg-ui__outer-container'


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
