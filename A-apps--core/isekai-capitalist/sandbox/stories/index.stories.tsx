import { Story, Meta } from '@storybook/react'

import { Enum } from 'typescript-string-enums'
import { to_react } from '@offirmo-private/rich-text-format-to-react'

import WithIphoneNotches from '@offirmo-private/storybook--utils/src/wrapper--with-iphone-notches'

import WithOffirmoCssSetup from '@offirmo-private/ui--browser--css/.storybook/wrapper--with-offirmo-css-setup'
import WithBodyFullWidth from '@offirmo-private/ui--browser--css/.storybook/wrapper--with-body-full-width'

//import { default_viewport__mobile } from '../../../../0-meta/storybook-viewports'

import '@oh-my-rpg/ui--browser--css/src/style.css'
import './index.css'

const LIB = '@isekai-capitalist/sandbox'

////////////////////////////////////////////////////////////////////////////////////

export default {
	title: LIB,
	//component: Component,
	argTypes: {
		//backgroundColor: { control: 'color' },
	},
	decorators: [
		(Story) => (<WithOffirmoCssSetup dark_theme_id='dark--colorhunt212'>{Story()}</WithOffirmoCssSetup>),
	],
} as Meta

////////////////////////////////////////////////////////////////////////////////////

export function Default() {
	return (
		<main>
			Hello, world!
		</main>
	)
}

////////////////////////////////////////////////////////////////////////////////////
import { SSRRank, render_ssr_rank } from '../src/type--SSR-rank'

export function GuildRank() {
	return (
		<main>
			{
				Enum.keys(SSRRank).map(rank => <div key={rank}>Adventurers Guild rank: {to_react(render_ssr_rank(rank))}</div>)
			}
		</main>
	)
}
