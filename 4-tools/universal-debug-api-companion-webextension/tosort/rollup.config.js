import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

module.exports = {
	input: 'src/api/full/index.js',
	output: {
		file: 'bundle.js',
		format: 'iife',
		name: 'foo',
	},
	plugins: [
		resolve(),
		commonjs(),
	],
}
