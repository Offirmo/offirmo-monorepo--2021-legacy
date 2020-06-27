import memoize_one from 'memoize-one'
import get_loader from '@offirmo-private/iframe-loading'

import { ↆcordova } from './cordova'
import logger from './logger'

ↆcordova.then(() => {
	// https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-splashscreen/index.html#preferences
	if ('splashscreen' in navigator) {
		navigator.splashscreen.hide()
	}
})


const declare_app_loaded = memoize_one(function _declare_app_loaded() {
	setTimeout(() => {
		logger.info('🙌 🙌 🙌 App loaded! 🙌 🙌 🙌')

		// @offirmo-private/iframe-loading
		get_loader().on_rsrc_loaded()
	})
})

export default declare_app_loaded
