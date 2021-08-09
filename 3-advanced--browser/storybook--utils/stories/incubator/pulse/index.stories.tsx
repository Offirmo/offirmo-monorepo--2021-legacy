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

export function Default() {
	const lib = get_singleton()

	let count = 0
	let time_1st_iteration: number = get_UTC_timestamp_ms()
	let time_last_iteration: number = 0

	function on_pulse(now_tms: number, id?: string) {
		console.log(`Pulse "${id}" received: #${count} / ${now_tms} (+${ ((now_tms - time_last_iteration) / 1000.).toFixed(3) }s)`)
		time_last_iteration = now_tms
	}

	useEffect(() => {
		return lib.subscribe_to_pulse('Pulse/storybook/default', on_pulse, {
			visual: true,
			cloud: false,
			min_period_ms: 100,
		})
	})

	return (
		<main>
			Demo of pulse

			TODO
		</main>
	)
}
