import memoize_one from 'memoize-one'
import get_loader from '@offirmo-private/iframe-loading'

import { ↆcordova } from './cordova'
import logger from './logger'


ↆcordova.finally(() => {
	// https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-splashscreen/index.html#preferences
	if ('splashscreen' in navigator) {
		navigator.splashscreen.hide()
	}
}).catch(() => {})


const declare_app_loaded = memoize_one(function _declare_app_loaded() {
	setTimeout(/*XXX*/() => {
		logger.info('🙌 🙌 🙌 App loaded! 🙌 🙌 🙌')

		// @offirmo-private/iframe-loading
		get_loader().on_rsrc_loaded()
	})
})

export default declare_app_loaded
