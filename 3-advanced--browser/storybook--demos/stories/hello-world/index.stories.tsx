import { Story, Meta } from '@storybook/react'

import HelloWorld, { HelloWorldProps } from '.'

////////////////////////////////////////////////////////////////////////////////////

export default {
	title: 'HelloWorld',
	component: HelloWorld,
	argTypes: {
		//backgroundColor: { control: 'color' },
	},
} as Meta

////////////////////////////////////////////////////////////////////////////////////

const StoryTemplate: Story<HelloWorldProps> = (args) => <HelloWorld {...args} />;

////////////////////////////////////////////////////////////////////////////////////

export const Default = StoryTemplate.bind({})
Default.args = {
}

export const Custom = StoryTemplate.bind({})
Custom.args = {
	who: 'you'
}
