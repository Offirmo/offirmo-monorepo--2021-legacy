import React, { Component } from 'react';

import ErrorBoundary from '../error-boundary'

import './index.css';

export class OhMyRpgUI extends Component {
	state = {
		isHamburgerMenuOpen: false,
		isAboutOpen: false,
	}

	toggleHamburgerMenu = () => {
		this.setState(state => ({
			isHamburgerMenuOpen: !state.isHamburgerMenuOpen,
		}))
	}

	toggleAbout = () => {
		this.setState(state => ({
			isAboutOpen: !state.isAboutOpen,
		}))
	}

	// TODO listen on error and suggest a refresh

	render() {
		return (
			<div className="o⋄top-container">

				<div className="omr⋄full-size-background-layer omr⋄bg-image⁚tiled-marble_black"/>

				<div className="omr⋄hud⁚top-left">
					<div className="omr⋄hamburger" onClick={this.toggleHamburgerMenu}>
						{this.state.isHamburgerMenuOpen
							? <span className="icomoon-undo2"/>
							: <span className="icomoon-menu"/>
						}
					</div>

					<div className="omr⋄logo" onClick={this.toggleAbout}>
						<ErrorBoundary name={'omr:logo'}>
							{this.props.logo}
						</ErrorBoundary>
					</div>

					<div className="omr⋄universe-anchor">
						<ErrorBoundary name={'omr:universe-anchor'}>
							{this.props.universeAnchor}
						</ErrorBoundary>
					</div>
				</div>

				<ErrorBoundary name={'omr:content'}>
					{this.props.children}
				</ErrorBoundary>

				<div className="omr⋄hud⁚bottom-right">
					<div className="omr⋄bottom-menu">
						<ErrorBoundary name={'omr:bottom-menu'}>
							{this.props.bottomMenuItems}
						</ErrorBoundary>
					</div>
				</div>

				{this.state.isAboutOpen &&
					<div
						key="aboutBlanket"
						id="about-panel"
						className="o⋄top-container omr⋄content-area omr⋄plane⁚meta"
						onClick={this.toggleAbout}>
						<ErrorBoundary name={'omr:about-blanket'}>
							{this.props.aboutContent}
						</ErrorBoundary>
					</div>
				}

				{this.state.isHamburgerMenuOpen &&
				<div
					key="hamburgerMenu"
					id="meta-panel"
					className="o⋄top-container omr⋄content-area omr⋄plane⁚meta">
					<ErrorBoundary name={'omr:hamburger-pane'}>
						{this.props.hamburgerPanelContent}
					</ErrorBoundary>
				</div>
				}
			</div>
		);
	}
}

export default OhMyRpgUI;
