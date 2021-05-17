import { Story, Meta } from '@storybook/react'

import HelloWorld, { HelloWorldProps } from '.'


export default {
	title: 'HelloWorld',
	component: HelloWorld,
	argTypes: {
		backgroundColor: { control: 'color' },
	},
} as Meta

const Template: Story<HelloWorldProps> = (args) => <HelloWorld {...args} />;

export const Primary = Template.bind({});
Primary.args = {
	primary: true,
	label: 'H',
};

export const Secondary = Template.bind({});
Secondary.args = {
	label: 'H',
};

export const Large = Template.bind({});
Large.args = {
	size: 'large',
	label: 'H',
};

export const Small = Template.bind({});
Small.args = {
	size: 'small',
	label: 'H',
};
