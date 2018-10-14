import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch, NavLink } from 'react-router-dom'

import {BASE_ROUTE, ROUTES} from '../../services/routes'
import {CHANNEL} from '../../services/channel'

import Home from '../pages/home'
import Savegame from '../pages/savegame'
import Dev from '../pages/dev'
import Diagnostic from '../pages/diagnostic'
import DevUI from '../meta/dev-area'

export default class Root extends Component {
	render() {
		return (
			<Fragment>

				<Router basename={BASE_ROUTE}>
					<Switch>
						<Route exact path={ROUTES.home} render={() => <Home />} />
						<Route exact path={ROUTES.savegame} render={() => <Savegame />} />
						<Route exact path={ROUTES.dev} render={() => <Dev />} />
						<Route exact path={ROUTES.diagnostic} render={() => <Diagnostic />} />

						{ /* fallback to home */ }
						<Redirect to={ROUTES.home} />
					</Switch>
				</Router>

				<DevUI
					channel={CHANNEL}/>

			</Fragment>
		)
	}
}
