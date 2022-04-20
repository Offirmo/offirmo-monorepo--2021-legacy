// typescript config https://webpack.js.org/configuration/configuration-languages/#typescript

console.log('🧙‍♂️  Hello from webpack.config.ts!')

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')

const { get_human_readable_UTC_timestamp_minutes } = require('../../../../1-stdlib/timestamps/dist/src.es7.cjs')

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

// the path we'll serve under in prod
const BASE_PATH = '/the-boring-rpg'
//const BASE_PATH = `/${PACKAGE_DIR}`

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
				//exclude: /node_modules/, // https://github.com/babel/babel/issues/6041
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
			// confirmed: manually declaring NODE_ENV is needed!
			'NODE_ENV': JSON.stringify(NODE_ENV),
			// WI = Webpack Injected
			WI_BASE_PATH: JSON.stringify(BASE_PATH), // inject it for react-router basename auto-detection
			WI_ENV: JSON.stringify(NODE_ENV),
			WI_VERSION: JSON.stringify(VERSION),
			WI_BUILD_DATE: JSON.stringify(BUILD_DATE),
		}),
		/*new webpack.NormalModuleReplacementPlugin(
			/\.\/random/,
			'./random-browser'
		),*/
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
	]
}


/******* PROD *******/

if (NODE_ENV === 'production') {
	// https://webpack.js.org/concepts/mode/
	config.mode = 'production'

	// disable broken minification
	// https://github.com/webpack/webpack/issues/6619#issuecomment-370204173
	config.optimization = {
		minimize: false,
	}
}

/******* DEV *******/

// SPECIAL, COMPLICATED technique:
// If we are in a monorepo and want to serve this sub-package on different URLs:
// - PROD: https://www.online-adventur.es/apps/the-boring-rpg/
// - STAGING: https://offirmo.netlify.com/C-apps--clients/the-boring-rpg/dist/
// - DEV/STAGING: http://localhost:8000/C-apps--clients/the-boring-rp/dist/
// - DEV: whatever, currently http://localhost:8080/the-boring-rpg
// For React router to work with this, it needs to be given a "basename".
// To make that works in dev, we simulate a sub-path in dev as well,
// by using a combo of `publicPath` and `contentBase`:
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
		watchOptions: {
			ignored: [
				path.resolve(__dirname, 'dist'),
				path.resolve(__dirname, 'node_modules'),
			],
		},
		allowedHosts: [
			'.ngrok.io'
		],
	}

	config.plugins.push(
		// https://github.com/FormidableLabs/electron-webpack-dashboard
		new DashboardPlugin(),
	)
	config.output.publicPath = PUBLIC_PATH

	console.log(`
🧙‍♂️  Remember to access this app from ${PUBLIC_PATH}
`)
}

/*********************/

module.exports = config
