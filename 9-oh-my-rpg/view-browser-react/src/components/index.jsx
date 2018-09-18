import React, { Component } from 'react'

import ErrorBoundary from '@offirmo/react-error-boundary'

import BurgerMenuWrapper from './burger-menu-wrapper'
import Main from './main'


import './index.css';

export class OhMyRpgUI extends Component {
	// TODO listen on error and suggest a refresh

	render() {
		return (
			<BurgerMenuWrapper
				burgerPanelContent={this.props.hamburgerPanelContent}
				mainContent={<Main {...this.props} />}
			/>
		);
	}
}
// mainContent={<span>[main content here]</span>}

OhMyRpgUI.defaultProps = {
	logo: <span>[Game name/logo here]</span>,
	bottomMenuItems: [],
	aboutContent: <span>This game was made by [x]...</span>,
	hamburgerPanelContent: <span>TODO put some settings here</span>
};

export default OhMyRpgUI;
