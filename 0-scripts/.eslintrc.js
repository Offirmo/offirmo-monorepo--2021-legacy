module.exports = {
	'env': {
		'node': true,
	},
	'extends': [
		'../0-meta/node.eslintrc.js',
	],
	'rules': {
		'no-console': 'off',
		'node/no-unpublished-require': 'off',
		'promise/catch-or-return': 'off', // it's ok, the script will crash
	}
}
