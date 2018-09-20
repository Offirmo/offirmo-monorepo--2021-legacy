module.exports = {
	'root': true,
	'env': {
		'es6': true,
		'mocha': true,
		'shared-node-browser': true,
	},
	'parserOptions': {
		'ecmaVersion': 2018,
		'sourceType': 'module',
		"ecmaFeatures": {
			"jsx": true,
		}
	},
	'plugins': [
		//'plugin:prettier/recommended',
		'node',
		'json',
		'mocha',
		'chai-expect',
		//'react',
	],
	'extends': [
		'eslint:recommended',
		//'prettier',
		//'plugin:node/recommended',
		//'plugin:compat/recommended',
		//'plugin:react/recommended',
	],
	"globals": {
		"require": true, // recognized by webpack / parcel, so always allowed.
	},
	'rules': {
		'no-console': 'warn',
		'indent': ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		'quotes': ['error', 'single'],
		'semi': ['error', 'never'],
		'mocha/no-exclusive-tests': 'error',
		'chai-expect/missing-assertion': 'error',
		'chai-expect/terminating-properties': 'error',
		'chai-expect/no-inner-compare': 'error',
	},
	'overrides': [
		{
			'files': ['**/doc/cheatsheet.js'],
			'env': {
				'node': true,
			},
			'rules': {
				'no-console': 'off',
			},
		},
		{
			'files': ['**/doc/**/*.js'],
			'rules': {
				'no-console': 'off',
			},
		},
	]
}
