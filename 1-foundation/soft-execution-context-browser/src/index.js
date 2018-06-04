//export * from '@offirmo/soft-execution-context'

import bowser from 'bowser'
import { getRootSEC } from '@offirmo/soft-execution-context'

// TODO protect from double install


// XXX redundant, next one is better (?rly)
// https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror
/*
function listenToErrors() {
	const SEC = getRootSEC()

	window.onerror = function (msg, url, line, colno, err) {
		console.log('DEBUG', arguments) // TODO analyze
		err = err || new Error(`Error "${msg}" from "${url}", line ${line}!`)

		SEC._handleError({
			SEC,
			debugId: 'browser/onError',
			shouldRethrow: false,
		}, err)

		return true; // same as preventDefault XXX should we?
	};
}
*/

function listenToErrorEvents() {
	const SEC = getRootSEC()
		.createChild()
		.setLogicalStack({operation: '(browser/on error event)'})

	window.addEventListener('error', function(evt) {
		// https://developer.mozilla.org/en-US/docs/Web/API/ErrorEvent
		//console.log('DEBUG SEC browser debug: error event', arguments) // TODO analyze
		const err = (evt && evt.message === 'Script error.')
			? new Error(`Error from another origin!`)
			: evt.error || new Error(`Error "${evt.message}" from "${evt.filename}", line ${evt.lineno}.${evt.colno}!`)

		SEC._handleError({
			SEC,
			debugId: 'browser/onError',
			shouldRethrow: false,
		}, err)

		evt.preventDefault(); // XXX should we?
	});
}

function listenToUnhandledRejections() {
	const SEC = getRootSEC()
		.createChild()
		.setLogicalStack({operation: '(browser/uncaught promise rejection)'})

	window.onunhandledrejection = function(evt) {
		// https://developer.mozilla.org/en-US/docs/Web/API/PromiseRejectionEvent
		//console.log('DEBUG SEC browser debug: onunhandledrejection', arguments) // TODO analyze
		const err = evt.reason || new Error(`Error: uncaught promise rejection!`)

		SEC._handleError({
			SEC,
			debugId: 'browser/uncaught promise rejection',
			shouldRethrow: false,
		}, err)

		return true; // same as preventDefault XXX should we?
	};
}

function decorateWithDetectedEnv() {
	const SEC = getRootSEC()

	const details = {
		browser_name: bowser.name,
		browser_version: bowser.version,
		device: bowser.tablet
			? 'tablet'
			: bowser.mobile
				? 'mobile'
				: 'desktop'
	}

	SEC.setAnalyticsDetails(details)
	SEC.setErrorReportDetails(details)
}



module.exports = {
	listenToErrorEvents,
	listenToUnhandledRejections,
	decorateWithDetectedEnv,
}
