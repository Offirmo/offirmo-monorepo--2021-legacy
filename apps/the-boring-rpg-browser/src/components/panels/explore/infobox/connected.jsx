import { throttle } from 'lodash'
import React, { Component } from 'react'
import ReactAnimationFrame from 'react-animation-frame';
import { get_UTC_timestamp_ms } from '@offirmo/timestamps'

import InfoboxView from './component'

const MAX_FPS = 24 // TODO load from prefs
const MIN_FRAME_PERIOD_MS = Math.trunc(1000. / MAX_FPS)

const MAX_ITERATIONS = 100 // debug


export class InfoBox extends Component {
	iteration_count = 0
    raf_time_start = 0
    time_1st_iteration = 0

	onAnimationFrame = throttle((time) => {
		const now_ms = get_UTC_timestamp_ms()

        if (!this.time_1st_iteration) {
            this.time_1st_iteration = now_ms
			console.log('starting animation frame', {
				now_ms,
				time,
			})
        }

		/*console.log('onAnimationFrame', {
            count: this.iteration_count,
            tsms: get_UTC_timestamp_ms(),
            time,
            now_ms,
        })*/

        // TODO change state
        
		if (MAX_ITERATIONS) {
            this.iteration_count++
			if (this.iteration_count > MAX_ITERATIONS) {
                const elapsed = now_ms - this.time_1st_iteration
                console.log(`stopping for safety`, {
                    raf_time_start: this.raf_time_start,
                    time_1st_iteration: this.time_1st_iteration,
                    now_ms,
                    elapsed,
                })
                console.log('measured fps =', 1000 * MAX_ITERATIONS / elapsed)
				return this.props.endAnimation()
			}
		}
	}, MIN_FRAME_PERIOD_MS)

	render() {
		console.log('render')

		return (
			<InfoboxView
                energy_float={2.7}
                next_energy_human='TODO'
                achievement_rate={.33}
            />
		)
	}
}

const InfoBoxRaf = ReactAnimationFrame(InfoBox)
export default InfoBoxRaf
