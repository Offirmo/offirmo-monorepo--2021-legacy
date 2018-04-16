// typescript config https://webpack.js.org/configuration/configuration-languages/#typescript

console.log('🧙‍♂️  Hello from webpack.config.ts!')

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
//const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
// https://github.com/webpack-contrib/mini-css-extract-plugin
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

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

/*********************/

const config: webpack.Configuration = {
	/////// BASE
	// https://webpack.js.org/guides/getting-started/
	entry: './src/index.jsx',
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: 'index.js',
		//publicPath: '', // force it ?
	},

	/////// LOADERS
	// https://webpack.js.org/guides/asset-management/
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
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
			// Options similar to the same options in webpackOptions.output
			filename: "index.css",
		}),
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
// - STAGING: https://offirmo.netlify.com/apps/the-boring-rpg/
// - DEV: (whatever works)
// We use a combo of `publicPath` and `contentBase`:

// content from webpack served from here:
const PUBLIC_PATH = `/${PACKAGE_DIR}/dist` // replicate prod setting
// content NOT from webpack served from here:
// XXX path relative to webpack dev server CWD!
const CONTENT_BASE = '..' // so that /our-package-name/xyz works

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
		/*new HtmlWebpackIncludeAssetsPlugin({
			assets: [
				'src/index.css',
			],
			append: true,
			hash: true,
		}),*/
	)
	config.output.publicPath = PUBLIC_PATH

}

/*********************/

module.exports = config

console.log(`
🧙‍♂️  Remember to access this app from ${PUBLIC_PATH}
`)
