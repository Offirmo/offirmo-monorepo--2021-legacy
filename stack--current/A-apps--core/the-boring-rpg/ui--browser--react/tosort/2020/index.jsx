import { Component } from 'react';

import { ScaleDown as BurgerMenu } from 'react-burger-menu'
import ErrorBoundary from '@offirmo/react-error-boundary'

import './index.css';

export class OhMyRpgUI extends Component {

	constructor() {
		super();
		this.state = {
			isHamburgerMenuOpen: false,
			isAboutOpen: false,
		}

		this.toggleHamburgerMenu = () => {
			this.setState(state => ({
				isHamburgerMenuOpen: !state.isHamburgerMenuOpen,
				isAboutOpen: false,
			}))
		}

		this.toggleAbout = () => {
			this.setState(state => ({
				isAboutOpen: !state.isAboutOpen,
				isHamburgerMenuOpen: false,
			}))
		}
	}

	// TODO listen on error and suggest a refresh

	render() {
		return (
			<div className="o⋄top-container">

				<BurgerMenu
					isOpen={this.state.isHamburgerMenuOpen}
				>

				<div className="omr⋄hud⁚top-left">
					<div className="omr⋄hamburger" onClick={this.toggleHamburgerMenu}>
						{this.state.isHamburgerMenuOpen
							? <span className="icomoon-undo2"/>
							: <span className="icomoon-menu"/>
						}
					</div>

					{this.props.logo && <div className="omr⋄logo" onClick={this.toggleAbout}>
						<ErrorBoundary name={'omr:logo'}>
							{this.props.logo}
						</ErrorBoundary>
					</div>}

					{this.props.logo && this.props.universeAnchor && <div className="omr⋄universe-anchor">
						<ErrorBoundary name={'omr:universe-anchor'}>
							{this.props.universeAnchor}
						</ErrorBoundary>
					</div>}
				</div>

				<ErrorBoundary name={'omr:content'}>
					{this.props.children}
				</ErrorBoundary>

				{this.props.bottomMenuItems.length > 0 && <div className="omr⋄hud⁚bottom-right">
					<div className="omr⋄bottom-menu">
						<ErrorBoundary name={'omr:bottom-menu'}>
							{this.props.bottomMenuItems}
						</ErrorBoundary>
					</div>
				</div>}

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


				</BurgerMenu>

			</div>
		);
	}
}

OhMyRpgUI.defaultProps = {
	logo: <span>[Game name/logo here]</span>,
	bottomMenuItems: [],
	aboutContent: <span>This game was made by [x]...</span>,
	hamburgerPanelContent: <span>TODO put some settings here</span>
};

export default OhMyRpgUI;
