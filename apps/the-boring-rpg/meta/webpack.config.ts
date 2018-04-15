const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const webpack = require('webpack')
const PACKAGE_JSON_PATH = path.join('..', 'package.json')
const { version } = require(PACKAGE_JSON_PATH)

// content from webpack served from here:
const PUBLIC_PATH = '/the-boring-rpg'
const NODE_ENV = process.env.NODE_ENV
console.log({NODE_ENV})
if(typeof NODE_ENV === 'undefined')
	throw new Error('Webpack config: NODE_ENV is not available!!!')
if(NODE_ENV !== 'development' && NODE_ENV !== 'production')
	throw new Error('Webpack config: NODE_ENV value is invalid!!!')

const config = {
	entry: './src/index.jsx',
	output: {
		path: path.resolve(__dirname, '..'),
		filename: 'index_bundle.js',
		//publicPath: '', // force it
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/, // https://github.com/babel/babel/issues/6041
				use: 'babel-loader',
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			}
		]
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
			VERSION: JSON.stringify(version),
			//PUBLIC_PATH: JSON.stringify(PUBLIC_PATH),
			ENV: JSON.stringify(NODE_ENV),
		}),
		new HtmlWebpackPlugin({
			// https://github.com/jantimon/html-webpack-plugin#configuration
			template: 'src/index.html',
			hash: true,
			showErrors: true,
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


if (NODE_ENV === 'production') {
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
	config.plugins.push(
		new HtmlWebpackIncludeAssetsPlugin({
			assets: [
				'assets/index.css',
			],
			append: true,
			hash: true,
		}),
	)
}
else {
	config.plugins.push(
		new HtmlWebpackIncludeAssetsPlugin({
			assets: [
				'src/index.css',
			],
			append: true,
			hash: true,
		}),
	)
	config.output.publicPath = PUBLIC_PATH
	config.devServer = {
		historyApiFallback: {
			index: PUBLIC_PATH,
		},
		// content NOT from webpack served from here:
		// XXX path relative to webpack dev server CWD!
		contentBase: '..',
	}

}

module.exports = config
