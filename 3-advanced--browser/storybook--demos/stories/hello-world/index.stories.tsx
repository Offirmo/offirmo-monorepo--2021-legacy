import { Story, Meta } from '@storybook/react'

import HelloWorld, { HelloWorldProps } from '.'

////////////////////////////////////////////////////////////////////////////////////

export default {
	title: 'HelloWorld',
	component: HelloWorld,
	argTypes: {
		backgroundColor: { control: 'color' },
	},
} as Meta

////////////////////////////////////////////////////////////////////////////////////

const StoryTemplate: Story<HelloWorldProps> = (args) => <HelloWorld {...args} />;

////////////////////////////////////////////////////////////////////////////////////

export const Primary = StoryTemplate.bind({});
Primary.args = {
	primary: true,
	label: 'H',
};

export const Secondary = StoryTemplate.bind({});
Secondary.args = {
	label: 'H',
};

export const Large = StoryTemplate.bind({});
Large.args = {
	size: 'large',
	label: 'H',
};

export const Small = StoryTemplate.bind({});
Small.args = {
	size: 'small',
	label: 'H',
};
