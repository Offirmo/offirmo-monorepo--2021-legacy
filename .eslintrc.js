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
		'ecmaFeatures': {
			'jsx': true,
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
	"settings": {
		"react": {
			"version": "16", // React version, default to the latest React stable release
		},
	},
	// TODO try 'all'
	'extends': [
		'eslint:recommended',
		//'prettier',
		//'plugin:node/recommended',
		'plugin:react/recommended',
	],
	'globals': {
		'require': true, // recognized by webpack / parcel, so always allowed.
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
		{
			'files': ['\\.eslintrc.js', 'prettier.config.js'],
			'env': {
				'node': true,
			},
		},
		{
			'files': ['**/*.ts'],
			'parser': 'typescript-eslint-parser',
			'plugins': [
				'typescript',
			],
			'rules': {
				'no-undef': 'off', // bug https://github.com/nzakas/eslint-plugin-typescript/issues/110
			},
		},
	]
}
