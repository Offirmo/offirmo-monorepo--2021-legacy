import React, { Component, Fragment, StrictMode } from 'react'
import PropTypes from 'prop-types'

import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'

import get_game_instance from '../services/game-instance-browser'
import { BASE_ROUTE, ROUTES } from '../services/routes'
import { CHANNEL } from '../services/channel'
import { AppStateListenerAndProvider } from '../context'

import Home from './pages/home'
import Savegame from './pages/savegame'
import Dev from './pages/dev'
import Diagnostic from './pages/diagnostic'
import DevUI from './0-meta/dev-area'

//console.log(__filename)
/////////////////////////////////////////////////

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
	static propTypes = {
	}

	render() {
		if (window.XOFF.flags.debug_render) console.log('🔄 Root')
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

				<DevUI
					channel={CHANNEL}
					onPlayPause={is_paused => {
						window.XOFF.flags.is_paused = is_paused
						if (is_paused)
							console.warn('⏸ Game is now paused!')
						else
							console.info('▶️ Game will now resume')
					}}
					onFastForward={() => get_game_instance().commands.custom(
						state => {
							const { n, d } = state.t_state.energy.available_energy
							return {
								...state,
								t_state: {
									...state.t_state,
									energy: {
										...state.t_state.energy,
										available_energy: {
											n: n+d,
											d,
										},
									},
								},
							}
						},
					)}
					onNext={() => get_game_instance().commands.custom(
						state => {
							return {
								...state,
								t_state: {
									...state.t_state,
									energy: {
										...state.t_state.energy,
										available_energy: {
											n: 1000, // will be capped
											d: 1,
										},
									},
								},
							}
						},
					)}
				/>
			</Fragment>
		)
	}
}
