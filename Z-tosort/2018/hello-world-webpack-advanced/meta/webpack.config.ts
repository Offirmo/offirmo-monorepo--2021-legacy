// typescript config https://webpack.js.org/configuration/configuration-languages/#typescript

const path = require('path')

console.log(`🧙‍♂️  Hello from webpack.config.ts from ${path.basename(__dirname)}!`)

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
//const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')
// TODO https://github.com/headfire94/package-json-cleanup-loader

const { get_human_readable_UTC_timestamp_minutes } = require('@offirmo/timestamps')

/*********************/

const PACKAGE_JSON_PATH = path.join('..', 'package.json')
const { version: VERSION } = require(PACKAGE_JSON_PATH)
const PACKAGE_DIR = path.basename(path.resolve(__dirname, '..'))
const NODE_ENV = process.env.NODE_ENV
const BUILD_DATE = get_human_readable_UTC_timestamp_minutes()

console.log('🧙‍♂️  Extracted variables:', {VERSION, PACKAGE_DIR, NODE_ENV, BUILD_DATE})
if(typeof NODE_ENV === 'undefined')
	throw new Error('Webpack config: NODE_ENV is not available!!!')
if(NODE_ENV !== 'development' && NODE_ENV !== 'production')
	throw new Error('Webpack config: NODE_ENV value is invalid!!!')

// in prod, we want to serve behind a path
const BASE_PATH = `/${PACKAGE_DIR}`

/*********************/

const config: webpack.Configuration = {
	//foo: 42,

	/////// BASE
	// https://webpack.js.org/guides/getting-started/
	entry: './src/index.jsx',
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: 'index.js',
	},

	/////// LOADERS
	// https://webpack.js.org/guides/asset-management/
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				// TODO check that
				exclude: /node_modules/, // https://github.com/babel/babel/issues/6041
				use: [
					'babel-loader',
				],
			},
			{
				test: /\.css$/,
				use: [
					//'style-loader',
					MiniCssExtractPlugin.loader,
					'css-loader',
				],
			},
			{
				test: /\.(png|jpg|woff|woff2|eot|ttf|svg)$/,
				use: [
					{
						// https://webpack.js.org/loaders/url-loader/
						loader: 'url-loader',
						options: {
							limit: 128,
						}
					},
				],
			},
			{
				// https://github.com/headfire94/package-json-cleanup-loader
				test: /package\.json$/,
				loader: 'package-json-cleanup-loader',
				options: {
					only: ['version', 'name']
				}
			},
		],
	},
	resolve: {
		extensions: ['.js', '.jsx'],
	},

	///////
	plugins: [
		new webpack.DefinePlugin({
			//'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
			// WI = Webpack Injected
			WI_BASE_PATH: JSON.stringify(BASE_PATH), // inject it for react-router basename auto-detection
			WI_ENV: JSON.stringify(NODE_ENV),
			WI_VERSION: JSON.stringify(VERSION),
			WI_BUILD_DATE: JSON.stringify(BUILD_DATE),
		}),
		new HtmlWebpackPlugin({
			// https://github.com/jantimon/html-webpack-plugin#configuration
			template: 'src/index.html',
			hash: true,
			showErrors: true,
		}),
		new MiniCssExtractPlugin({
			// https://github.com/webpack-contrib/mini-css-extract-plugin
			// Options similar to the same options in webpackOptions.output
			filename: 'index.css',
		}),
		new CopyWebpackPlugin([
			{
				// note: relative to cwd!
				from: 'src/favicons',
				// note: relative to output dir!
				to: 'favicons',
				// safety
				toType: 'dir',
			},
		]),

		/*
		new HtmlWebpackIncludeAssetsPlugin({
			assets: [
				'assets/normalize.css',
				'assets/index.css',
			],
			append: true,
			hash: true,
		}),*/
	]
}


/******* PROD *******/

if (NODE_ENV === 'production') {
	// https://webpack.js.org/concepts/mode/
	config.mode = 'production'
	// https://reactjs.org/docs/optimizing-performance.html#use-the-production-build
	/*
	const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
	config.plugins.push(
		new UglifyJsPlugin({
			// https://github.com/webpack-contrib/uglifyjs-webpack-plugin#uglifyoptions
			cache: true,
			parallel: true,
			sourceMap: true,
			uglifyOptions: {
				ecma: 8,
				warnings: true,
				parse: {
					ecma: 8,
				},
			},
		}),
	)
	*/
	/*config.plugins.push(
		new HtmlWebpackIncludeAssetsPlugin({
			assets: [
				'assets/index.css',
			],
			append: true,
			hash: true,
		}),
	)*/
}

/******* DEV *******/

// SPECIAL, COMPLICATED technique:
// If we are in a monorepo and want to serve this sub-package on different URLs:
// - PROD: https://www.online-adventur.es/the-boring-rpg/
// - STAGING: https://offirmo.netlify.com/A-apps/dist/the-boring-rpg/
// - DEV/STAGING: http://localhost:8000/A-apps/the-boring-rp/dist/
// For React router to work with this, it needs to be given a "basename"
// to make that works in dev, we simulate a sub-path in dev as well:
// - DEV: http://localhost:8080/the-boring-rpg
// We use a combo of `publicPath` and `contentBase`:
// content from webpack served from here:
const PUBLIC_PATH = BASE_PATH // replicate prod setting
// content NOT from webpack served from here:
// XXX try to NOT SERVE ANYTHING through this,
//     there are webpack plugins to solve that!
// XXX path relative to webpack dev server CWD!
const CONTENT_BASE = '../dist' // so that /our-package-name/index.html/favicon.xyz works

if (NODE_ENV !== 'production') {
	// https://webpack.js.org/concepts/mode/
	config.mode = 'development'
	// https://webpack.js.org/guides/development/
	config.devtool = 'inline-source-map'
	config.devServer = {
		// content NOT from webpack served from here:
		// XXX path relative to webpack dev server CWD!
		contentBase: CONTENT_BASE,
		// ..
		historyApiFallback: {
			index: PUBLIC_PATH,
		},
	}

	config.plugins.push(
		// https://github.com/FormidableLabs/electron-webpack-dashboard
		new DashboardPlugin(),
		/*new HtmlWebpackIncludeAssetsPlugin({
			assets: [
				'src/index.css',
			],
			append: true,
			hash: true,
		}),*/
	)
	config.output.publicPath = PUBLIC_PATH

	console.log(`
🧙‍♂️  Remember to access this app from ${PUBLIC_PATH}
`)
}

/*********************/

module.exports = config
