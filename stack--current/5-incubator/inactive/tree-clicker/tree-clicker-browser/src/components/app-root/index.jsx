import { Component } from 'react'

import './index.css'

//import {get_state, tick} from '../../model'
import OmrRoot from '../omr-root'

//const FRAME_RATE = 10

export default class AppRoot extends Component {
/*
	componentDidMount() {
		// TODO detect window out of view
		this.updateRepainter()
	}

	updateRepainter = () => {
		if (this.repaint) {
			clearInterval(this.repaint)
			this.forceUpdate()
		}

		this.repaint = setInterval(() => {
			this.forceUpdate()
		}, 1000 / FRAME_RATE)
	}*/

	render() {
		/*this.frameCount = ((this.frameCount || 0) + 1) % FRAME_RATE
		if (this.frameCount === 0) {
			let now = new Date().getTime();
			console.log(now - window.performance.timing.navigationStart)
		}
		// {this.frameCount}
		*/
		return (
			<OmrRoot />
		)
	}
}
