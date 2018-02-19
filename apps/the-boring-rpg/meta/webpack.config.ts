const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const PACKAGE_JSON_PATH = path.join('..', 'package.json')
const { version } = require(PACKAGE_JSON_PATH)

// content from webpack served from here:
const PUBLIC_PATH = '/the-boring-rpg'
const NODE_ENV = process.env.NODE_ENV
console.log({NODE_ENV})

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
			VERSION: JSON.stringify(version),
			PUBLIC_PATH: JSON.stringify(PUBLIC_PATH),
			NODE_ENV: JSON.stringify(NODE_ENV),
		}),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(NODE_ENV),
			}
		}),
		new HtmlWebpackPlugin({
			// https://github.com/jantimon/html-webpack-plugin#configuration
			template: 'src/index.html',
			hash: true,
			showErrors: true,
		})
	]
}


if (process.env.NODE_ENV === 'production') {
	console.log('prod detected')
	const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
	config.plugins.push(
		new UglifyJsPlugin(),
	)
}
else {
	console.log('dev detected')
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
