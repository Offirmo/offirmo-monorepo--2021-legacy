const webpack = require('webpack')
const path = require('path')

// https://github.com/netlify/netlify-lambda#webpack-configuration

// https://github.com/liady/webpack-node-externals
const nodeExternals = require('webpack-node-externals')

module.exports = {
	optimization: { minimize: false },
	resolve: {
		alias: {
			//'./dialects/*/index.js': './dialects/postgres/index.js'
		}
	},
	externals: [
		/*
		'tedious',
		'mssql',
		'mysql', 'mysql2',
		'oracle', 'oracledb',
		'redshift',
		'sqlite3',
		*/
		/*nodeExternals({
			whitelist: [ /^@offirmo/, /^@tbrpg/ ],
		}),*/
	],
	plugins: [
		new webpack.NormalModuleReplacementPlugin(/pg-native/, 'noop2'),
		new webpack.ContextReplacementPlugin(/knex\/lib\/dialects/, /postgres\/index.js/),
		//knexContextReplacement('lib/migrate/sources', './src/migrations'),
		//knexContextReplacement('lib/seed', './src/seeds'),
	],
};
