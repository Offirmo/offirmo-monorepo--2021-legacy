import React, { Component } from 'react';
import './index.css';

export class OhMyRpg extends Component {
	state = {
		isHamburgerOpen: false,
	}

	onHamburgerClick = () => {
		this.setState(state => ({
			isHamburgerOpen: !state.isHamburgerOpen,
		}))
	}

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
						{this.props.universeAnchor}
					</div>
				</div>

				{this.props.children}

				<div className="omr⋄bottom-hud">
					<div className="omr⋄bottom-menu">
						{this.props.bottomMenuItems}
					</div>
				</div>

				{this.state.isHamburgerOpen &&
					<div
						key="omr⋄plane⁚meta"
						className="omr⋄plane⁚meta omr⋄full-size-background-layer omr⋄bg-color⁚bg-main--translucent"
					/>
				}
			</div>
		);
	}
}

export default OhMyRpg;
