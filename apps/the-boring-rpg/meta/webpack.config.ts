const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const PACKAGE_JSON_PATH = path.join('..', 'package.json')
const { version } = require(PACKAGE_JSON_PATH)

// content from webpack served from here:
const PUBLIC_PATH = '/the-boring-rpg'

const config = {
	entry: './src/index.jsx',
	output: {
		path: path.resolve(__dirname, '..'),
		filename: 'index_bundle.js',
		//publicPath: PUBLIC_PATH,
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
		}),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			}
		}),
		new HtmlWebpackPlugin({
			template: 'src/index.html'
		})
	]
}


if (process.env.NODE_ENV === 'production') {
	const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
	config.plugins.push(
		new UglifyJsPlugin(),
	)
}
else {
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
