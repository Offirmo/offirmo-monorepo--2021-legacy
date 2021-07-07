module.exports = {
	'stories': [
		'../stories/*.stories.mdx',
		'../stories/**/*.stories.mdx',
		'../stories/**/*.stories.@(js|jsx|ts|tsx)',
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
	reactOptions: {
		fastRefresh: true,
		strictMode: true,
	},
}
