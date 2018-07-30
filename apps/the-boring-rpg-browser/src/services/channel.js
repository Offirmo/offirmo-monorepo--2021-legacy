
const CHANNEL = window.location.hostname === 'www.online-adventur.es'
	? 'prod'
	: window.location.hostname === 'offirmo.netlify.com'
		? 'staging'
		: 'dev'

export {
	CHANNEL,
}
