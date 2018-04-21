import React, { Component } from 'react';

import ErrorBoundary from '../error-boundary'

import './index.css';

export class OhMyRpgUI extends Component {
	state = {
		isHamburgerOpen: false,
	}

	onHamburgerClick = () => {
		this.setState(state => ({
			isHamburgerOpen: !state.isHamburgerOpen,
		}))
	}

	// TODO listen on error and suggest a refresh

	render() {
		return (
			<div className="o⋄top-container">

				<div className="omr⋄full-size-background-layer omr⋄bg-image⁚tiled-marble_black"/>

				<div className="omr⋄top-hud">
					<div className="omr⋄hamburger" onClick={this.onHamburgerClick}>
						{this.state.isHamburgerOpen
							? <span className="icomoon-undo2"/>
							: <span className="icomoon-menu"/>
						}
					</div>

					<div className="omr⋄logo">
						{this.props.logo}
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

				<div className="omr⋄bottom-hud">
					<div className="omr⋄bottom-menu">
						<ErrorBoundary name={'omr:bottom-menu'}>
							{this.props.bottomMenuItems}
						</ErrorBoundary>
					</div>
				</div>

				{this.state.isHamburgerOpen &&
					<div
						key="omr⋄plane⁚meta"
						className="omr⋄meta-panel omr⋄content-area omr⋄plane⁚meta">
						<ErrorBoundary name={'omr:hamburger-pane'}>
							{this.props.hamburgerPanel}
						</ErrorBoundary>
					</div>
				}
			</div>
		);
	}
}

export default OhMyRpgUI;
