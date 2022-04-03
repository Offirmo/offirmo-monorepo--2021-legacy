import Bowser from 'bowser'
import { getRootSEC } from '@offirmo-private/soft-execution-context'
import ensureDeviceUUID from '@offirmo-private/ensure-device-uuid-browser'
import { LS_KEYS } from './consts'


// XXX redundant, next one is better (?rly)
// https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror
/*
function listenToErrors() {
	const SEC = getRootSEC()

	window.onerror = function (msg, url, line, colno, err) {
		console.log('DEBUG', arguments)
		err = err || new Error(`Error "${msg}" from "${url}", line ${line}!`)

		SEC._handleError({
			SEC,
			debugId: 'browser/onError',
			shouldRethrow: false,
		}, err)

		return true // same as preventDefault XXX should we?
	}
}
*/

function listenToErrorEvents() {
	const SEC = getRootSEC()
		.createChild()
		.setLogicalStack({operation: '(browser/on error event)'})

	SEC.xTry('SEC/browser/listenToErrorEvents', ({logger}) => {

		window.addEventListener('error', function(evt) {
			// https://developer.mozilla.org/en-US/docs/Web/API/ErrorEvent
			//console.log('DEBUG SEC browser debug: error event', arguments)
			const err = (evt && evt.message === 'Script error.')
				? new Error('Unreadable error from another origin!')
				: evt.error || new Error(`Error "${evt.message}" from "${evt.filename}", line ${evt.lineno}.${evt.colno}!`)

			SEC._handleError({
				SEC,
				debugId: 'browser/onError',
				shouldRethrow: false,
			}, err)

			//evt.preventDefault() // XXX should we?
		})

		logger.verbose('Root SEC is now listening to error events ✔')
	})
}


function listenToUnhandledRejections() {
	const SEC = getRootSEC()
		.createChild()
		.setLogicalStack({operation: '(browser/unhandled rejection)'})

	SEC.xTry('SEC/browser/listenToUnhandledRejections', ({logger}) => {

		//window.onunhandledrejection = function(evt) {
		window.addEventListener('unhandledrejection', function(evt) {
			// https://developer.mozilla.org/en-US/docs/Web/API/PromiseRejectionEvent
			//console.log('DEBUG SEC browser debug: onunhandledrejection', arguments)
			//console.log(evt.reason)
			const err = evt.reason || new Error('Error: uncaught promise rejection!')

			SEC._handleError({
				SEC,
				debugId: 'browser/unhandled rejection',
				shouldRethrow: false,
			}, err)
		})

		logger.verbose('Root SEC is now listening to unhandled rejection events ✔')
	})
}


function decorateWithDetectedEnv(SEC) {
	SEC = SEC || getRootSEC()

	const IS_DEV_MODE = localStorage.getItem(LS_KEYS.dev_mode) === 'true'
	const IS_VERBOSE = localStorage.getItem(LS_KEYS.verbose) === 'true'

	SEC.injectDependencies({
		IS_DEV_MODE,
		IS_VERBOSE,
	})

	const browser = Bowser.getParser(window.navigator.userAgent)
	const details = {
		DEVICE_UUID: ensureDeviceUUID(),
		// TODO normalize browser/os detection!
		OS_NAME: browser.getOSName(),
		OS_RELEASE: browser.getOSVersion(),
		BROWSER_NAME: browser.getBrowserName(),
		BROWSER_VERSION: browser.getBrowserVersion(),
		DEVICE_TYPE: browser.getPlatformType(),
	}

	SEC.setAnalyticsAndErrorDetails(details)
	//xxx.logger.verbose('Root SEC is now decorated with env infos ✔', { Bowser: browser.getResult(), details: SEC.getAnalyticsDetails() })
}


export * from '@offirmo-private/soft-execution-context'
export {
	listenToErrorEvents,
	listenToUnhandledRejections,
	decorateWithDetectedEnv,
}
