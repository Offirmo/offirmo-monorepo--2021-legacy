const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// https://github.com/netlify/netlify-lambda#webpack-configuration

module.exports = {
	optimization: { minimize: false }, // better errors
	plugins: [
		// force unused dialects to resolve to the only one we use
		// and for whom we have the dependencies installed
		new webpack.ContextReplacementPlugin(/knex\/lib\/dialects/, /postgres\/index.js/),
		// pg optionally tries to require pg-native
		// replace it by a noop (real module from npm)
		new webpack.NormalModuleReplacementPlugin(/pg-native/, 'noop2'),
		// same with pg-query-stream
		new webpack.NormalModuleReplacementPlugin(/pg-query-stream/, 'noop2'),
		// https://www.npmjs.com/package/webpack-bundle-analyzer
		//new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
	],
}
