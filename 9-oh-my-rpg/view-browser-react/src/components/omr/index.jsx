import React, { Component } from 'react'
import NotificationSystem from 'react-notification-system'

import ErrorBoundary from '@offirmo/react-error-boundary'

import { OhMyRPGUIContext } from '../state-context'
import './index.css';


function TopLeftHud({isBurgerMenuOpen, openBurgerMenu, logo, toggleAbout, universeAnchor, }) {
	return (
		<div className="omr⋄hud⁚top-left">
			<div className="omr⋄hamburger" onClick={openBurgerMenu}>
				{isBurgerMenuOpen
					? <span className="icomoon-undo2"/>
					: <span className="icomoon-menu"/>
				}
			</div>

			{logo && <div className="omr⋄logo" onClick={e => {e.preventDefault();toggleAbout()}}>
				<ErrorBoundary name={'omr:logo'}>
					{logo}
				</ErrorBoundary>
			</div>}

			{logo && universeAnchor && <div className="omr⋄universe-anchor">
				<ErrorBoundary name={'omr:universe-anchor'}>
					{universeAnchor}
				</ErrorBoundary>
			</div>}
		</div>
	)
}

function BottomRightHud({bottomMenuItems}) {
	return bottomMenuItems.length > 0 && (
		<div className="omr⋄hud⁚bottom-right">
			<div className="omr⋄bottom-menu">
				<ErrorBoundary name={'omr:bottom-menu'}>
					{bottomMenuItems}
					<div className="omr⋄bottom-menu--selected-indicator"/>
				</ErrorBoundary>
			</div>
		</div>
	)
}

function Main({children, logo, universeAnchor, bottomMenuItems, bottomMarkerIndex, aboutContent}) {
	return (
		<OhMyRPGUIContext.Consumer>
			{({isBurgerMenuOpen, openBurgerMenu, isAboutOpen, toggleAbout, _registerNotificationSystem}) => {
				const css_selected_bottom_menu_value = -bottomMenuItems.length + 1 + ((bottomMarkerIndex >= 0) ? bottomMarkerIndex : -1)
				document.documentElement.style.setProperty(
					'--omr⋄ui__bottom-menu--selected-reverse-index',
					css_selected_bottom_menu_value
				)

				return (
					<div className="o⋄top-container">

						<div className="omr⋄hud⁚shifts-hider"/>

						<TopLeftHud {...{isBurgerMenuOpen, openBurgerMenu, logo, toggleAbout, universeAnchor}} />

						<div className="o⋄top-container omr⋄content">
							<ErrorBoundary name={'omr:content'}>
								{children}
							</ErrorBoundary>
						</div>

						<BottomRightHud {...{bottomMenuItems, bottomMarkerIndex}} />

						{isAboutOpen && <div
							key="aboutBlanket"
							id="about-panel"
							className="omr⋄about o⋄top-container omr⋄content-area omr⋄plane⁚meta"
							onClick={toggleAbout}>
							<ErrorBoundary name={'omr:about-blanket'}>
								<div className="omr-auto-logo">{logo}</div>
								{aboutContent}
							</ErrorBoundary>
						</div>}

						<ErrorBoundary name={'omr:notification-system'}>
							<NotificationSystem ref={_registerNotificationSystem} />
						</ErrorBoundary>
					</div>
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
	burgerPanelContent: <span>put some settings here</span>
}

export default Main
