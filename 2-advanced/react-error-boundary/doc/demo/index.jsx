import React, { Component } from 'react';

import ErrorBoundary from '@offirmo/react-error-boundary'

import './index.css';

export class Test extends Component {

	render() {
		return (
			<div className="o⋄top-container">

				{this.props.logo && <div className="omr⋄logo" onClick={this.toggleAbout}>
					<ErrorBoundary name={'omr:logo'}>
						{this.props.logo}
					</ErrorBoundary>
				</div>}
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
