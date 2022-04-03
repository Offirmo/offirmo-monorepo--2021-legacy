import memoize_one from 'memoize-one'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'

import React, { useState, useEffect } from 'react';
import { Story, Meta } from '@storybook/react'


import { get_singleton } from '.'

////////////////////////////////////////////////////////////////////////////////////

export default {
	title: 'Pulse',
	//component: Component,
	argTypes: {
		//backgroundColor: { control: 'color' },
	},
} as Meta

////////////////////////////////////////////////////////////////////////////////////

const get_hour_minute_formatter = memoize_one(function _get_date_formatter(): (date_tms: number) => string {
	const intl_date_formatter = new Intl.DateTimeFormat(undefined, {
		//dateStyle: 'short',
		timeStyle: 'short',
		hourCycle: 'h23',
	} as any)

	return intl_date_formatter.format
})

const get_hour_minute_sec_formatter = memoize_one(function _get_date_formatter(): (date_tms: number) => string {
	const intl_date_formatter = new Intl.DateTimeFormat(undefined, {
		//dateStyle: 'short',
		timeStyle: 'medium',
		hourCycle: 'h23',
	} as any)

	return intl_date_formatter.format
})

////////////////////////////////////////////////////////////////////////////////////

export function Default() {
	console.log('render…')
	const lib = get_singleton()

	const [ minutes, set_minutes ] = useState(0)
	const [ seconds, set_seconds ] = useState(0)
	const [ milliseconds, set_milliseconds ] = useState(0)

	///////
	;(() => {
		let count = 0
		let time_1st_iteration: number = get_UTC_timestamp_ms()
		let time_last_iteration: number = 0

		function on_pulse(now_tms: number, id?: string) {
			console.log(`Pulse "${id}" received: #${count} / ${now_tms} (+${ ((now_tms - time_last_iteration) / 1000.).toFixed(3) }s)`)
			time_last_iteration = now_tms
			set_minutes(now_tms)
		}

		useEffect(() => {
			return lib.subscribe_to_pulse('Pulse/storybook/default--minutes', on_pulse, {
				visual: true,
				cloud: false,
				ideal_period_ms: 1000 * 60,
			})
		})
	})()

	;(() => {
		let count = 0
		let time_1st_iteration: number = get_UTC_timestamp_ms()
		let time_last_iteration: number = 0

		function on_pulse(now_tms: number, id?: string) {
			console.log(`Pulse "${id}" received: #${count} / ${now_tms} (+${ ((now_tms - time_last_iteration) / 1000.).toFixed(3) }s)`)
			time_last_iteration = now_tms
			set_seconds(now_tms)
		}

		useEffect(() => {
			return lib.subscribe_to_pulse('Pulse/storybook/default--seconds', on_pulse, {
				visual: true,
				cloud: false,
				ideal_period_ms: 1000,
			})
		})
	})()

	;(() => {
		let count = 0
		let time_1st_iteration: number = get_UTC_timestamp_ms()
		let time_last_iteration: number = 0

		function on_pulse(now_tms: number, id?: string) {
			console.log(`Pulse "${id}" received: #${count} / ${now_tms} (+${ ((now_tms - time_last_iteration) / 1000.).toFixed(3) }s)`)
			time_last_iteration = now_tms
			set_milliseconds(now_tms)
		}

		/*useEffect(() => {
			return lib.subscribe_to_pulse('Pulse/storybook/default--milliseconds', on_pulse, {
				visual: true,
				cloud: false,
				ideal_period_ms: 1,
			})
		})*/
	})()

	return (
		<main>
			Demo of pulse<br/>
			milliseconds = {milliseconds}<br/>
			seconds = {get_hour_minute_sec_formatter()(seconds)}<br/>
			minutes = {get_hour_minute_formatter()(minutes)}<br/>
			TODO
		</main>
	)
}

////////////////////////////////////////////////////////////////////////////////////

interface State {
	minutes_ms: number
	seconds_ms: number
	millis_ms: number
}

export function View({ state }: {state: State}) {
	return (
		<p>
			milliseconds = {state.millis_ms}<br/>
			seconds = {get_hour_minute_sec_formatter()(state.seconds_ms)}<br/>
			minutes = {get_hour_minute_formatter()(state.minutes_ms)}<br/>
		</p>
	)
}



class AdvancedComponent extends React.Component {
	state = {
		minutes_ms: 0,
		seconds_ms: 0,
		millis_ms: 0,
	}

	start_ms = +(new Date())
	unsubs: any[] = []

	constructor (props: never) {
		super(props)
	}

	componentDidMount () {
		///////
		const lib = get_singleton()

		;(() => {
			let count = 0
			let time_last_iteration: number = 0

			const on_pulse = (now_tms: number, id?: string) => {
				console.log(`Pulse "${id}" received: #${count} / ${now_tms} (+${ ((now_tms - time_last_iteration) / 1000.).toFixed(3) }s)`)
				time_last_iteration = now_tms
				count++
				this.setState({minutes_ms: now_tms})
			}

			this.unsubs.push(lib.subscribe_to_pulse('Pulse/storybook/advanced--minutes', on_pulse, {
				visual: true,
				cloud: false,
				ideal_period_ms: 1000 * 60,
			}))
		})()

		;(() => {
			let count = 0
			let time_last_iteration: number = 0

			const on_pulse = (now_tms: number, id?: string) => {
				console.log(`Pulse "${id}" received: #${count} / ${now_tms} (+${ ((now_tms - time_last_iteration) / 1000.).toFixed(3) }s)`)
				time_last_iteration = now_tms
				count++
				this.setState({seconds_ms: now_tms})
			}

			this.unsubs.push(lib.subscribe_to_pulse('Pulse/storybook/advanced--seconds', on_pulse, {
				visual: true,
				cloud: false,
				ideal_period_ms: 1000,
			}))
		})()

		;(() => {
			let count = 0
			let time_last_iteration: number = 0

			const on_pulse = (now_tms: number, id?: string) => {
				//console.log(`Pulse "${id}" received: #${count} / ${now_tms} (+${ ((now_tms - time_last_iteration) / 1000.).toFixed(3) }s)`)
				time_last_iteration = now_tms
				count++
				this.setState({millis_ms: now_tms})
			}

			this.unsubs.push(lib.subscribe_to_pulse('Pulse/storybook/advanced--milliseconds', on_pulse, {
				visual: true,
				cloud: false,
				ideal_period_ms: 1,
			}))
		})()
	}


	render () {
		console.log('~~ render')
		return (
			<>
				<p>
					Demo of pulse<br/>
					started on {get_hour_minute_sec_formatter()(this.start_ms)}
				</p>
				<hr/>
				<View
				<p>
					milliseconds = {this.state.millis_ms}<br/>
					seconds = {get_hour_minute_sec_formatter()(this.state.seconds_ms)}<br/>
					minutes = {get_hour_minute_formatter()(this.state.minutes_ms)}<br/>
				</p>
			</>
		)
	}

	// https://facebook.github.io/react/docs/component-specs.html#unmounting-componentwillunmount
	componentWillUnmount () {
		console.info('~~ componentWillUnmount', arguments)
		while (this.unsubs.length) {
			this.unsubs[0]()
			this.unsubs.shift()
		}
	}
}

export function Advanced() {
	console.log('Pulse/storybook/advanced render…')

	return (<AdvancedComponent />)
}

export function Context() {
	console.log('Pulse/storybook/context render…')


	const StateContext = React.createContext(0)

	const lib = get_singleton()

	let count = 0


	return (
		<StateContext.Provider value={count}>
			TODO
		</StateContext.Provider>
	);
}
