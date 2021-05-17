module.exports = {
	'stories': [
		'../stories/**/*.stories.mdx',
		'../stories/**/*.stories.@(js|jsx|ts|tsx)',
	],
	'addons': [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
	],
	typescript: {
		check: true, // Enabling fork-ts-checker-webpack-plugin for unlocking type-checking
		checkOptions: {
			//eslint: true,
		},
		reactDocgen: "react-docgen-typescript",
	},
	reactOptions: {
		fastRefresh: true,
		strictMode: true,
	},
}
