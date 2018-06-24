import React, { Component, Fragment } from 'react';
import { throttle } from 'lodash'
import hotkeys from 'hotkeys-js'
import { get_UTC_timestamp_ms } from '@offirmo/timestamps'

import ReactAnimationFrame from 'react-animation-frame';

import * as Model from '../../model'

import './index.css'

const INITIAL_STATE = Model.create()
const MIN_FRAME_MS = 100 // debug
const MAX_ITERATION = 100

export class MainArea extends Component {
	state = {
		model_state: INITIAL_STATE,
		ui: Model.get_derived_ui(INITIAL_STATE),
	}

	safety_during_dev = 0
	time_start = 0

	onAnimationFrame = throttle((time) => {
		//const test = get_UTC_timestamp_ms()

		if (!this.time_start) {
			const now_ms = get_UTC_timestamp_ms()
			this.time_start = now_ms - Math.trunc(time)
			console.log('calibrating animation frame', {
				now_ms,
				time,
				time_trunc: Math.trunc(time),
				time_start: this.time_start,
			})
		}

		const now_ms = this.time_start + Math.trunc(time)
		//console.log('onAnimationFrame', time, now_ms, test, test - now_ms)
		console.log('onAnimationFrame')

		if (MAX_ITERATION) {
			this.safety_during_dev++
			if (this.safety_during_dev > 100) {
				console.log(`stopping for safety (${MAX_ITERATION})`)
				return this.props.endAnimation()
			}
		}

		const new_model_state = Model.update(this.state.model_state, {DEBUG: false})
		if (new_model_state !== this.state.model_state) {
			this.setState({
				model_state: new_model_state,
				ui: Model.get_derived_ui(new_model_state, {DEBUG: false})
			})
		}
	}, MIN_FRAME_MS)

	click = () => {
		const new_model_state = Model.click(this.state.model_state)
		this.setState({
			model_state: new_model_state,
			ui: Model.get_derived_ui(new_model_state),
	  })
	}

	render() {
		console.log('render')

		return (
			<Fragment>
				<ul>
					<li>Wasted ideas: {this.state.ui.wasted_ideas}</li>
				</ul>
				<div className="">
				<button onClick={() => {
					this.click()
				}}>Play</button>
			</Fragment>
		)
	}
}


const MainAreaRaf = ReactAnimationFrame(MainArea)
export default MainAreaRaf

/*

				<div>
					<ul>
						{state.clicker_enhancers.map((ce, index) => {
							return <button key={ce.name} disabled={ce.owned || state.xp < ce.price}>{ce.name} ({ce.prod_added?`+${ce.prod_added}`:''})</button>
						})}
					</ul>
				</div>
				<div>
					<ul>
						{state.auto_clickers.map((ac, index) => {
							return <button key={ac.name} disabled={ac.owned || state.xp < ac.price}>{ac.name} ({ac.click_per_s_added?`+${ac.click_per_s_added}`:''})</button>
						})}
					</ul>
				</div>
				<button>Test</button>
				<button disabled>XXX</button>
 */
