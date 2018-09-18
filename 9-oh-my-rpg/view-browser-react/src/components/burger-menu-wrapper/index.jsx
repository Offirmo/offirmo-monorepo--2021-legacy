import React, { Component } from 'react'

import BurgerMenu from 'react-burger-menu/lib/menus/scaleDown'
import ErrorBoundary from '@offirmo/react-error-boundary'

import './index.css';

// technical elements needed by burger-menu scale down
// https://github.com/negomi/react-burger-menu#properties
const PAGE_WRAP_ID = 'oh-my-rpg-ui__page-wrap'
const OUTER_CONTAINER_ID = 'oh-my-rpg-ui__outer-container'


function BurgerMenuWrapper({mainContent, hamburgerPanelContent}) {
	return (
		<div id={OUTER_CONTAINER_ID} className="o⋄top-container">

			<BurgerMenu
				pageWrapId={PAGE_WRAP_ID}
				outerContainerId={OUTER_CONTAINER_ID}
			>
				<ErrorBoundary name={'omr:burger-menu:menu'}>
					{hamburgerPanelContent}
				</ErrorBoundary>
			</BurgerMenu>

			<div id={PAGE_WRAP_ID} className="o⋄top-container">
				<ErrorBoundary name={'omr:burger-menu:main'}>
					{mainContent}
				</ErrorBoundary>
			</div>
		</div>
	);
}

export default BurgerMenuWrapper
