module.exports = {
	'stories': [
		'../stories/**/*.stories.mdx',
		'../stories/**/*.stories.@(js|jsx|ts|tsx)',
	],
	'addons': [
		'@geometricpanda/storybook-addon-iframe',
		//require.resolve('storybook-addon-grid/preset'),
		'@storybook/addon-essentials',
		'@storybook/addon-links',
		'storybook-dark-mode/register',
	],
	typescript: {
		check: true, // Enabling fork-ts-checker-webpack-plugin for unlocking type-checking
		checkOptions: {
			//eslint: true,
		},
		reactDocgen: 'react-docgen-typescript',
	},
	reactOptions: {
		fastRefresh: true,
		strictMode: true,
	},
}
