import * as React from 'react'
import { Component } from 'react'
import memoize_one from 'memoize-one'

import BurgerMenu from 'react-burger-menu/lib/menus/scaleDown'
import ErrorBoundary from '@offirmo-private/react-error-boundary'

import './index.css'

// technical elements needed by burger-menu scale down
// https://github.com/negomi/react-burger-menu#properties
const PAGE_WRAP_ID = 'oh-my-rpg-ui__page-wrap'
const OUTER_CONTAINER_ID = 'oh-my-rpg-ui__outer-container'

const BurgerMenuWrapperViewM = React.memo(
	function BurgerMenuWrapperView({isBurgerMenuOpen, onUpdateBurgerMenu, mainContent, logo, burgerPanelContent}) {
		if (window.oᐧextra.flagꓽdebug_render) console.log('🔄 [OMR]BurgerMenuWrapperView')

		return (
			<div id={OUTER_CONTAINER_ID} className="o⋄top-container">
				<BurgerMenu
					isOpen={isBurgerMenuOpen}
					pageWrapId={PAGE_WRAP_ID}
					outerContainerId={OUTER_CONTAINER_ID}
					onStateChange={onUpdateBurgerMenu}
				>
					<ErrorBoundary name={'omr:burger-menu:menu'}>
						<div className="omr-auto-logo">{logo}</div>
						{isBurgerMenuOpen && burgerPanelContent}
					</ErrorBoundary>
				</BurgerMenu>

				<div id={PAGE_WRAP_ID} className="o⋄top-container">
					<ErrorBoundary name={'omr:burger-menu:main'}>
						{mainContent}
					</ErrorBoundary>
				</div>
			</div>
		)
	},
)

export default BurgerMenuWrapperViewM
