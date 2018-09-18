import React, { Component } from 'react';

import ErrorBoundary from '@offirmo/react-error-boundary'

import './index.css';

function Main({children, isHamburgerMenuOpen, toggleHamburgerMenu, toggleAbout, logo, universeAnchor, bottomMenuItems, isAboutOpen, aboutContent}) {
	return (
		<main className="o⋄top-container">

			<div className="omr⋄hud⁚top-left">
				<div className="omr⋄hamburger" onClick={toggleHamburgerMenu}>
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

			{/*this.props.isHamburgerMenuOpen &&
			<div
				key="hamburgerMenu"
				id="meta-panel"
				className="o⋄top-container omr⋄content-area omr⋄plane⁚meta">
				<ErrorBoundary name={'omr:hamburger-pane'}>
					{this.props.hamburgerPanelContent}
				</ErrorBoundary>
			</div>
			*/}

		</main>
	)
}
Main.defaultProps = {
	logo: <span>[Game name/logo here]</span>,
	bottomMenuItems: [],
	aboutContent: <span>This game was made by [x]...</span>,
	hamburgerPanelContent: <span>TODO put some settings here</span>
}

export default Main
