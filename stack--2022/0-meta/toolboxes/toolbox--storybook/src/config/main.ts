module.exports = {
	'stories': [
		//'../stories/*.stories.mdx',
		//'../stories/**/*.stories.mdx',
		'../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)',
	],
	'addons': [
		'@geometricpanda/storybook-addon-iframe',
		'@storybook/addon-essentials',
		'@storybook/addon-links',
		'storybook-addon-jsx',
		'storybook-dark-mode/register',
		'storybook-mobile',
		//require.resolve('storybook-addon-grid/preset'),
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
