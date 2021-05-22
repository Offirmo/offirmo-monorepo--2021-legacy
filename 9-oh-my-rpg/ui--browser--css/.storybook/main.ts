module.exports = {
	'stories': [
		'../stories/*.stories.mdx',
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
	reactOptions: {
		fastRefresh: true,
		strictMode: true,
	},
}
