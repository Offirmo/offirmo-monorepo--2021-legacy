
const CHANNEL = window.location.hostname === 'www.online-adventur.es'
	? 'stable'
	: window.location.hostname === 'offirmo.netlify.com'
		? 'staging'
		: 'dev'

export {
	CHANNEL,
}
