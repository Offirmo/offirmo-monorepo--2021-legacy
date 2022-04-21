import { Story, Meta } from '@storybook/react'

import Component, { Props } from '.'

////////////////////////////////////////////////////////////////////////////////////

export default {
	title: 'react-swipeable-views',
	//component: HelloWorld,
	argTypes: {
		//backgroundColor: { control: 'color' },
	},
} as Meta

////////////////////////////////////////////////////////////////////////////////////

const StoryTemplate: Story<Props> = (args) => <Component {...args} />;

////////////////////////////////////////////////////////////////////////////////////

export const Default = StoryTemplate.bind({})
Default.args = {
}

export const Custom = StoryTemplate.bind({})
Custom.args = {
	//who: 'you'
}
