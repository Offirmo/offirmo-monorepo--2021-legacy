import React, { Component, Fragment, StrictMode } from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'

import {BASE_ROUTE, ROUTES} from '../services/routes'
import {CHANNEL} from '../services/channel'
import { AppStateListenerAndProvider } from '../context'

import Home from './pages/home'
import Savegame from './pages/savegame'
import Dev from './pages/dev'
import Diagnostic from './pages/diagnostic'
import DevUI from './meta/dev-area'

//const StrictCheck = StrictMode
const StrictCheck = Fragment

// TODO https://reactjs.org/docs/react-api.html#reactlazy
function render_home() {
	return (
		<StrictCheck>
			<AppStateListenerAndProvider>
				<Home />
			</AppStateListenerAndProvider>
		</StrictCheck>
	)
}
function render_savegame() {
	return (
		<StrictCheck>
			<Savegame />
		</StrictCheck>
	)
}
function render_dev() {
	return (
		<StrictCheck>
			<Dev />
		</StrictCheck>
	)
}
function render_diagnostic() {
	return (
		<StrictCheck>
			<Diagnostic />
		</StrictCheck>
	)
}

export default class Root extends Component {
	render() {
		console.log('🔄 Root')
		return (
			<Fragment>

				<Router basename={BASE_ROUTE}>
					<Switch>
						<Route exact path={ROUTES.home} render={render_home} />
						<Route exact path={ROUTES.savegame} render={render_savegame} />
						<Route exact path={ROUTES.dev} render={render_dev} />
						<Route exact path={ROUTES.diagnostic} render={render_diagnostic} />

						{ /* fallback to home */ }
						<Redirect to={ROUTES.home} />
					</Switch>
				</Router>

				<DevUI channel={CHANNEL}/>
			</Fragment>
		)
	}
}