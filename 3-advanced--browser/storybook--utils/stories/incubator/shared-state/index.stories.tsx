import React, { useState, useEffect } from 'react';
import { Story, Meta } from '@storybook/react'

import { get_singleton, render } from '.'

////////////////////////////////////////////////////////////////////////////////////

export default {
	title: 'SharedState',
	//component: Component,
	argTypes: {
		//backgroundColor: { control: 'color' },
	},
} as Meta

////////////////////////////////////////////////////////////////////////////////////

export function Default() {
	const lib = get_singleton()
	const [ state, set_state ] = useState(lib.get())

	function on_state_change() {
		set_state(lib.get())
	}

	useEffect(() => {
		return lib.subscribe(on_state_change, 'SharedState/storybook/default')
	})

	return (
		<main>
			Demo of Shared State
			<pre>
				{render(state)}
			</pre>
		</main>
	)
}
Default.parameters = {
	viewport: {
		defaultViewport: 'responsive',
	},
}
