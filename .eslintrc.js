module.exports = {
	"env": {
		"es6": true,
		"mocha": true,
	},
	"parserOptions": {
		"ecmaVersion": 2018,
		"sourceType": "module",
	},
	"plugins": [
		"plugin:prettier/recommended",
		"node",
		"json",
		"mocha",
		"chai-expect",
		"react",
	],
	"extends": [
		"eslint:recommended",
		"prettier",
		"plugin:node/recommended",
		"plugin:compat/recommended",
		"plugin:react/recommended",
	],
	"rules": {
		'no-console': 'warn',
		"indent": ["error", "tab"],
		"linebreak-style": ["error", "unix"],
		"quotes": ["error", "single"],
		"semi": ["error", "never"],
		"mocha/no-exclusive-tests": "error",
		"chai-expect/missing-assertion": "error",
		"chai-expect/terminating-properties": "error",
		"chai-expect/no-inner-compare": "error",
	}
};
