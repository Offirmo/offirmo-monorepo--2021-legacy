import React, { Component, Fragment, StrictMode } from 'react'
import PropTypes from 'prop-types'

import { AppStateListenerAndProvider } from '../context'
import GlobalSwitch from './global-switch'
import Overrides from './overrides'


const StrictCheck = StrictMode
//const StrictCheck = Fragment

export default class Root extends Component {
	static propTypes = {
	}

	render() {
		return (
			<StrictCheck>
				<AppStateListenerAndProvider>
					<h3>Universal Web Dev Tool</h3>
					<GlobalSwitch />
					<Overrides />
				</AppStateListenerAndProvider>
			</StrictCheck>
		)
	}
}
