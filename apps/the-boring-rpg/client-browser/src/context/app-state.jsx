import {throttle} from 'lodash'
import React, {Component} from 'react'
import ReactAnimationFrame from 'react-animation-frame';
import {get_UTC_timestamp_ms} from '@offirmo/timestamps'

import get_game_instance from '../services/game-instance-browser'
import {InfoBoxC2} from "../components/panels/explore/infobox/connected";

const game_instance = get_game_instance()
const MAX_FPS = 1. // TODO load from prefs
const MIN_FPS = .1 // ex. for a background tab
const MIN_FPS_FRAME_PERIOD_MS = Math.trunc(1000. / MIN_FPS)
const MAX_FPS_FRAME_PERIOD_MS = Math.trunc(1000. / MAX_FPS)
//const MAX_ITERATIONS = 10000 // debug

// https://reactjs.org/docs/context.html
const DEFAULT_VALUE = { init: 'initial AppState pending...'}
const AppStateContext = React.createContext(DEFAULT_VALUE)

let subscribedId = 0
class AppStateListenerAndProviderX1 extends React.Component {
	iteration_count = 0
	raf_time_start = 0
	time_1st_iteration = null
	time_last_iteration = null
	id = ++subscribedId
	unsubscribeAppStateListener = null
	intervalId = null

	state = {
		app_state: DEFAULT_VALUE,
	}

	constructor (props) {
		super(props)
		//console.log({MIN_FPS_FRAME_PERIOD_MS, MAX_FPS_FRAME_PERIOD_MS})


		/*if (this.id > 1)
			throw new Error('Incorrect duplicate AppStateListenerAndProviderX1!')*/

		// we use Animation Frame for a smooth, adaptable framerate
		// however, since AF pauses when background, we need to back it up
		// with a slow interval.
		this.intervalId = setInterval(this.update_to_now, MIN_FPS_FRAME_PERIOD_MS)
	}

	componentDidMount() {
		this.unsubscribeAppStateListener = game_instance.subscribe(`app-state-${this.id}`, () => {
			console.log(`▶ AppStateListenerAndProvider #${this.id}: updating on app state change`, game_instance.view.get_state())
			this.setState({
				app_state: game_instance.view.get_state()
			})
		})
	}
	componentWillUnmount () {
		this.unsubscribeAppStateListener()
		this.unsubscribeAppStateListener = null

		clearInterval(this.intervalId)
		this.intervalId = null
	}

	update_to_now = throttle((time) => {
		const now_ms = this.time_last_iteration = get_UTC_timestamp_ms()

		if (!this.time_1st_iteration) {
			// debug
			this.time_1st_iteration = now_ms
			console.log('++++++++++++ starting animation frame ++++++++++++', {
				now_ms,
				time,
			})
		}

		console.log(`———————————— onInterval/onAnimationFrame #${this.iteration_count} ————————————`, {
			//tsms: get_UTC_timestamp_ms(),
			//time,
			now_ms,
		})
		this.iteration_count++

		// TODO change state?
		game_instance.reducers.update_to_now()

		if (MAX_ITERATIONS) {
			if (this.iteration_count > MAX_ITERATIONS) {
				const elapsed = now_ms - this.time_1st_iteration
				console.log(`stopping animation frame for safety`, {
					raf_time_start: this.raf_time_start,
					time_1st_iteration: this.time_1st_iteration,
					now_ms,
					elapsed,
				})
				console.log('measured fps =', 1000 * MAX_ITERATIONS / elapsed)
				return this.props.endAnimation()
			}
		}
	}, MAX_FPS_FRAME_PERIOD_MS)

	onAnimationFrame = this.update_to_now

	render() {
		console.log(`🔄 AppStateListenerAndProviderX1`, this.state);

		return (
			<AppStateContext.Provider value={this.state.app_state}>
				{this.props.children}
			</AppStateContext.Provider>
		)
	}
}
const AppStateListenerAndProvider = ReactAnimationFrame(AppStateListenerAndProviderX1)
//const AppStateListenerAndProvider = AppStateListenerAndProviderI1

export default AppStateContext

export {
	AppStateContext,
	AppStateListenerAndProvider,
}
