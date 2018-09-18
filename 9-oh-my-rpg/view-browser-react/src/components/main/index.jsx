import React, { Component } from 'react';

import ErrorBoundary from '@offirmo/react-error-boundary'

import './index.css';

function Main({children, toggleBurgerMenu, toggleAbout, logo, universeAnchor, bottomMenuItems, aboutContent}) {
	const isHamburgerMenuOpen = false // TODO remove
	const isAboutOpen = false // TODO

	return (
		<main className="o⋄top-container">
			<div className="omr⋄hud⁚shifts-hider" />

			<div className="omr⋄hud⁚top-left">
				<div className="omr⋄hamburger" onClick={toggleBurgerMenu}>
					{isHamburgerMenuOpen
						? <span className="icomoon-undo2"/>
						: <span className="icomoon-menu"/>
					}
				</div>

				{logo && <div className="omr⋄logo" onClick={toggleAbout}>
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

			<ErrorBoundary name={'omr:content'}>
				{children}
			</ErrorBoundary>

			{bottomMenuItems.length > 0 && <div className="omr⋄hud⁚bottom-right">
				<div className="omr⋄bottom-menu">
					<ErrorBoundary name={'omr:bottom-menu'}>
						{bottomMenuItems}
					</ErrorBoundary>
				</div>
			</div>}

			{isAboutOpen &&
			<div
				key="aboutBlanket"
				id="about-panel"
				className="o⋄top-container omr⋄content-area omr⋄plane⁚meta"
				onClick={this.toggleAbout}>
				<ErrorBoundary name={'omr:about-blanket'}>
					{aboutContent}
				</ErrorBoundary>
			</div>
			}

		</main>
	)
}
Main.defaultProps = {
	toggleBurgerMenu: () => { console.warn('TODO implement Oh My RPG UI toggleBurgerMenu() !') },
	toggleAbout: () => { console.warn('TODO implement Oh My RPG UI toggleAbout() !') },
	logo: <span>[Game name/logo here]</span>,
	bottomMenuItems: [],
	aboutContent: <span>This game was made by [x]...</span>,
	hamburgerPanelContent: <span>TODO put some settings here</span>
}

export default Main
