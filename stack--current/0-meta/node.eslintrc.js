module.exports = {
	'env': {
		'node': true,
	},
	'plugins': [
		'node',
	],
	'extends': [
		'plugin:node/recommended',
	],
	'rules': {
		'node/no-extraneous-require': 'off',  // TODO, too much noise for now
		'node/no-missing-require': 'off', // buggy and no way we could miss that
		'node/shebang': 'off', // off my lawn!
		'node/no-unpublished-require': 'off', // monorepo
		'node/no-unsupported-features/es-syntax': 'off',  // TODO, too much noise for now

		'@typescript-eslint/no-var-requires': 'off', // irrelevant
	},
}
