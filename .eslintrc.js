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
	],
	"rules": {
		'no-console': 'warn',
		"indent": ["error", "tab"],
		"linebreak-style": ["error", "unix"],
		"quotes": ["error", "single"],
		"semi": ["error", "never"],
	}
};
