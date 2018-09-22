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
		'import',
		'node',
		'json',
		'mocha',
		'chai-expect',
		'react',
		'promise',
		'eslint-comments',
	],
	'settings': {
		'react': {
			'version': '16', // React version, default to the latest React stable release
		},
		/*'import/parsers': {
			'typescript-eslint-parser': ['.ts', '.tsx'],
		},*/
		'import/resolver': {
			'node': {
				'extensions': [
					'.js',
					'.jsx',
					'.ts',
				]
			}
		}
	},
	// TODO try 'all'
	'extends': [
		'eslint:recommended',
		'plugin:import/errors',
		//'prettier',
		//'plugin:node/recommended',
		'plugin:react/recommended',
		'plugin:promise/recommended',
		'plugin:eslint-comments/recommended',
	],
	'globals': {
		'require': true, // recognized by webpack / parcel, so always allowed.
	},
	'rules': {
		'indent': ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		'no-console': 'off',  // TODO, too much noise for now
		'no-unused-vars': 'off',  // TODO, too much noise for now
		'quotes': ['error', 'single'],
		'semi': ['error', 'never'],
		'chai-expect/missing-assertion': 'error',
		'chai-expect/no-inner-compare': 'error',
		'chai-expect/terminating-properties': 'error',
		'eslint-comments/disable-enable-pair': 'off',  // TODO, too much noise for now
		'import/no-unresolved': 'off', // buggy and no way we could miss that
		'mocha/no-exclusive-tests': 'error',
		'node/no-extraneous-require': 'off',  // TODO, too much noise for now
		'node/no-unsupported-features/es-syntax': 'off',  // TODO, too much noise for now
		'react/prop-types': 'off',  // TODO, too much noise for now
		'react/display-name': 'off',  // TODO, too much noise for now
	},
	'overrides': [
		{
			'files': ['**/*.ts'],
			'parser': 'typescript-eslint-parser',
			'plugins': [
				'typescript',
			],
			'rules': {
				'no-undef': 'off', // bug https://github.com/nzakas/eslint-plugin-typescript/issues/110
				'no-unused-vars': 'off', // bug https://github.com/nzakas/eslint-plugin-typescript/issues/150
				//'import/no-unresolved': 'off', // bug on resolving .ts
				'import/named': 'off', // bug on types
				'typescript/adjacent-overload-signatures': 'error',
				'typescript/class-name-casing': 'error',
				'typescript/explicit-function-return-type': 'off', // TODO
				'typescript/explicit-member-accessibility': 'error',
				'typescript/interface-name-prefix': 'error',
				'typescript/member-delimiter-style': {'delimiter': 'none'},
				'typescript/member-naming': 'error',
				'typescript/member-ordering': 'off', // TODO
				'typescript/no-angle-bracket-type-assertion': 'error',
				'typescript/no-array-constructor': 'error',
				'typescript/no-empty-interface': 'off', // TODO
				'typescript/no-explicit-any': 'off', // TODO reactivate sometimes
				'typescript/no-inferrable-types': 'off',
				'typescript/no-namespace': 'error',
				'typescript/no-non-null-assertion': 'off', // TODO reactivate sometimes
				'typescript/no-var-requires': 'off', // TODO
				'typescript/no-parameter-properties': 'error',
				'typescript/no-triple-slash-reference': 'error',
				'typescript/no-type-alias': 'off',
				'typescript/no-unused-vars': 'error',
				'typescript/no-use-before-define': 'off', // TODO
				'typescript/prefer-namespace-keyword': 'error',
				'typescript/type-annotation-spacing': 'error',
			},
		},
		{
			'files': ['**/doc/**/*.{ts,js,jsx}', 'webpack.config.ts'],
			'rules': {
				'no-unused-vars': 'off',
				'no-console': 'off',
				'typescript/no-var-requires': 'off',
			},
		},
		{
			'files': ['**/*_spec.ts'],
			'rules': {
				'typescript/explicit-function-return-type': 'off',
			},
		},
		{
			'files': ['**/doc/cheatsheet.js'],
			'env': {
				'node': true,
			},
			'rules': {
				'no-console': 'off',
				'node/no-extraneous-require': 'off',
			},
		},
		{
			'files': ['\\.eslintrc.js', 'prettier.config.js', 'webpack.config.ts'],
			'env': {
				'node': true,
			},
		},
	]
}
