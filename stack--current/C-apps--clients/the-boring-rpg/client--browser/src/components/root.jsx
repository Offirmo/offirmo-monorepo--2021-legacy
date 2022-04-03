import { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { MemoryRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
//import floating from 'floating.js'
import { get_xoff_flag, set_xoff_flag } from '@offirmo-private/xoff'

import get_game_instance from '../services/game-instance-browser'
import { get_base_route, ROUTES } from '../services/routes'
import { CHANNEL } from '../services/channel'
import { AppStateListenerAndProvider } from '../context'

import Home from './pages/home'
import Savegame from './pages/savegame'
import Dev from './pages/dev'
import Diagnostic from './pages/diagnostic'
import DevUI from './meta/dev-area'

/////////////////////////////////////////////////

//const StrictCheck = StrictMode
const StrictCheck = Fragment

/*floating({
	content: '<span style="color: snow;">❄</span>',
	number: 25,
	direction: 'reverse',
	size: [1, 3].map(x => x * .5),
})
*/

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

	BASE_ROUTE = get_base_route()

	render() {
		if (window.oᐧextra.flagꓽdebug_render) console.log('🔄 Root')
		return (
			<Fragment>

				<Router basename={this.BASE_ROUTE}>
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
						set_xoff_flag('is_paused', is_paused)
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
