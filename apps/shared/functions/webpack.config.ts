// https://github.com/netlify/netlify-lambda#webpack-configuration

// https://github.com/liady/webpack-node-externals
const nodeExternals = require('webpack-node-externals')

module.exports = {
	//target: 'node', // in order to ignore built-in modules like path, fs, etc.
	externals: [
		nodeExternals({
			whitelist: [ /^@offirmo/, /^@tbrpg/ ],
		}),
	],
};
