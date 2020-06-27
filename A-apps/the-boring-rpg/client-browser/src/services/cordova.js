import Deferred from '@offirmo/deferred'

import logger from './logger'

export const ↆcordova = new Deferred()

document.addEventListener("deviceready", () => {
	ↆcordova.resolve()
}, false)

ↆcordova.then(() => {
	logger.info('Cordova deviceready!')
})
