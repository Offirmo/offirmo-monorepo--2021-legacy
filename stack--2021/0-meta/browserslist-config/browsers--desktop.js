module.exports = [
	// https://github.com/browserslist/browserslist#best-practices
	// I'm not following the best practices by cherry-picking the browsers,
	// because as an indie I don't have the time to really test that many browsers.
	// HOWEVER I hope that selecting "Firefox ESR" should make that work for old browsers.
	// Suggestions welcome!
	'Firefox ESR', // so that my apps don't become broken too fast if I don't maintain them for some reason (life).

	'last 2 Firefox versions',
	'last 2 Chrome versions',
	// not adding Safari, supporting 3 browsers is already enough. Pretty sure it works anyway.

	'not dead',
]
