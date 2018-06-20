import React, { Component, Fragment } from 'react';

import ReactAnimationFrame from 'react-animation-frame';

import { get_state, play, tick } from '../../model'

import './index.css'

export class MainArea extends Component {

	onAnimationFrame(time) {
		// TODO update state
		//console.log('raf')
		this.forceUpdate()
	}

	componentDidMount() {
		this.refreshTick()
	}

	refreshTick = () => {
		if (this.tick) {
			clearInterval(this.tick)
			tick() // bonus
			//this.forceUpdate()
		}

		const state = get_state()
		console.log('refreshTick', state.gamer_status)
		/*this.gamer_status = state.gamer_status

		if (!state.gamer_status.auto_period_ms)
			return*/

		this.tick = setInterval(() => {
			tick()
			//this.forceUpdate()
		}, 50)
	}

	render() {
		const state = get_state()

		return (
			<Fragment>
				<ul>
					<li>Gamer status: {state.gamer_status.name}</li>
					<li>XP: {state.xp}</li>
					<li>Level: {state.level}</li>
				</ul>
				<button onClick={() => {
					play()
					/*const state = get_state()
					if (state.gamer_status !== this.gamer_status)
						this.refreshTick()
					this.forceUpdate()*/
				}}>Play</button>
				<ul>
					<li>XP/click: 1</li>
					{/*state.gamer_status.auto_period_ms && <li>Auto-play: {1000./state.gamer_status.auto_period_ms}/s</li>*/}
				</ul>
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
			</Fragment>
		)
	}
}


const MainAreaRaf = ReactAnimationFrame(MainArea)
export default MainAreaRaf
