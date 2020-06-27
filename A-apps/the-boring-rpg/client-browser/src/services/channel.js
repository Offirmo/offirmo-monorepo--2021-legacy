
function is_cordova() {
	return window.location.protocol === 'file:' && (new URLSearchParams(location.search)).get('container') === 'cordova'
}
function is_prod() {
	return window.location.hostname === 'www.online-adventur.es'
		|| is_cordova()
}

const CHANNEL = is_prod()
	? 'prod'
	: window.location.hostname === 'offirmo-monorepo.netlify.com'
		? 'staging'
		: 'dev'

export {
	CHANNEL,
}
