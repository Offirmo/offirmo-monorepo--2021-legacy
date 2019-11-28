import React, { Component } from 'react'
import NotificationSystem from 'react-notification-system'

import ErrorBoundary from '@offirmo-private/react-error-boundary'

import './index.css'


const TopLeftHudViewM = React.memo(
	function TopLeftHudView({openBurgerMenu, logo, toggleAbout, universeAnchor }) {
		if (window.XOFF && window.XOFF.debug_render) console.log('🔄 [OMR]TopLeftHudView')

		return (
			<div className="omr⋄hud⁚top-left">
				<div className="omr⋄hamburger" onClick={openBurgerMenu}>
					<span className="icomoon-menu"/>
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
	},
)

const BottomRightHudViewM = React.memo(
	function BottomRightHudView({ bottomMenuItems }) {
		if (window.XOFF && window.XOFF.debug_render) console.log('🔄 [OMR]BottomRightHudView')

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
	},
)

const MainViewM = React.memo(
	function MainView({
		children,
		logo,
		universeAnchor,
		bottomMenuItems,
		aboutContent,
		openBurgerMenu,
		isAboutOpen,
		toggleAbout,
		_registerNotificationSystem,
	}) {
		if (window.XOFF && window.XOFF.debug_render) console.log('🔄 [OMR]MainView')

		return (
			<div className="o⋄top-container">

				<div className="omr⋄hud⁚shifts-hider"/>

				<TopLeftHudViewM {...{openBurgerMenu, logo, toggleAbout, universeAnchor}} />

				<div className="o⋄top-container omr⋄content">
					<ErrorBoundary name={'omr:content'}>
						{children}
					</ErrorBoundary>
				</div>

				<BottomRightHudViewM {...{bottomMenuItems}} />

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
	},
)

export default MainViewM
