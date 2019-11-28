import throttle from 'lodash/throttle'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ReactAnimationFrame from 'react-animation-frame'
import {get_UTC_timestamp_ms} from '@offirmo-private/timestamps'

import get_game_instance from '../services/game-instance-browser'
import logger from '../services/logger'
import { AppStateListenerAndProvider } from './app-state'

const MAX_FPS = 1. // TODO load from prefs?
const MIN_FPS = .1 // ex. for a background tab
const MIN_FPS_FRAME_PERIOD_MS = Math.trunc(1000. / MIN_FPS)
const MAX_FPS_FRAME_PERIOD_MS = Math.trunc(1000. / MAX_FPS)
const MAX_ITERATIONS = 0 //10 // debug


class AppStateListenerAndProviderRAF extends React.Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
	}

	iteration_count = 0
	raf_time_start = 0
	time_1st_iteration = null
	time_last_iteration = null
	intervalId = null

	componentDidMount() {
		// we use Animation Frame for a smooth, adaptable framerate
		// however, since AF pauses when background,
		// we need to back it up with a slow interval.
		this.intervalId = setInterval(this.update_to_now, MIN_FPS_FRAME_PERIOD_MS)
	}
	componentWillUnmount () {
		clearInterval(this.intervalId)
		this.intervalId = null
	}

	update_to_now = throttle((time) => {
		if (window.XOFF.flags.is_paused) return

		const now_ms = this.time_last_iteration = get_UTC_timestamp_ms()

		if (!this.time_1st_iteration) {
			// debug
			this.time_1st_iteration = now_ms
			logger.log('++++++++++++ starting animation frame ++++++++++++', {
				now_ms,
				time,
			})
		}

		logger.groupEnd()
		logger.groupCollapsed(`——————— onInterval/onAnimationFrame #${this.iteration_count} / ${now_ms} ———————`)
		this.iteration_count++
		setTimeout(() => logger.groupEnd())

		get_game_instance().commands.update_to_now()

		if (MAX_ITERATIONS) {
			if (this.iteration_count > MAX_ITERATIONS) {
				const elapsed = now_ms - this.time_1st_iteration
				logger.warn('stopping animation frame for safety', {
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
		if (window.XOFF.flags.debug_render) console.log('🔄 AppStateListenerAndProviderRAF')

		return (
			<AppStateListenerAndProvider>
				{this.props.children}
			</AppStateListenerAndProvider>
		)
	}
}
const AppStateListenerAndProviderRAF2 = ReactAnimationFrame(AppStateListenerAndProviderRAF)

export default AppStateListenerAndProviderRAF2
