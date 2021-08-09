import { Story, Meta } from '@storybook/react'

import { get_sugar } from '.'

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
	const lib = get_sugar()

	const unsub1 = lib.subscribe_to_pulse('test1', (tms: number, id?: string) => {
		console.log(`pulse ${id}`, { tms })
	}, {
		frequency: 100,
	})

	return (
		<main>
			Demo of pulse

			TODO
		</main>
	)
}
