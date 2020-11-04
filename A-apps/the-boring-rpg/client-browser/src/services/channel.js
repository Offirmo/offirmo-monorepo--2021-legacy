'use strict'

import { is_loaded_from_cordova } from './cordova'

function is_prod() {
	return window.location.hostname === 'www.online-adventur.es'
		|| is_loaded_from_cordova()
}

const CHANNEL = is_prod()
	? 'prod'
	: (window.location.hostname === 'offirmo-monorepo.netlify.com' || window.location.hostname === 'offirmo-monorepo.netlify.app')
		? 'staging'
		: 'dev'

export {
	CHANNEL,
}
