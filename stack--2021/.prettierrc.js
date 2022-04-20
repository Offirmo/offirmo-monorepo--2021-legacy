module.exports = {
	// https://prettier.io/docs/en/options.html
	useTabs: true,
	semi: false,
	singleQuote: true,
	trailingComma: 'all',
	endOfLine: 'lf',

	'overrides': [
		{
			'files': '*.{ts,tsx}',
			'options': {
				'parser': 'typescript'
			}
		}
	]
}
