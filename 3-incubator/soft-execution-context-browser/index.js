"use strict";

const { LIB, INTERNAL_PROP } = require('../soft-execution-context/constants')
const { createCatcher } = require('../catch-factory')
const {
	isSEC,
	create: createCore,
	setRoot,
	getContext,
} = require('../soft-execution-context/core')
const { createLogger } = require('../universal-logger-browser')

function create(...args) {
	const SEC = createCore(...args)

	// TODO protect from double install

	// https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror

	function listenToErrors() {
		if (!SEC[INTERNAL_PROP].LS.module)
			throw new Error(`${LIB}›listenToErrors() must only be called in the context of an app! (who are you to mess with globals, lib author??)`)

		const sub_SEC = SEC.child({operation: '(uncaught error via window.onerror)'})

		const catchFn = createCatcher({
			decorators: sub_SEC[INTERNAL_PROP].errDecorators,
			onError: sub_SEC[INTERNAL_PROP].onError,
			debugId: 'browser/onError',
		})

		window.onerror = function (msg, url, line, colno, err) {
			console.log(arguments) // TODO analyze
			err = err || new Error(`Error "${msg}" from "${url}", line ${line}!`)
			catchFn(err)
			return true; // same as preventDefault XXX should we?
		};
	}

	function listenToErrorEvents() {
		if (!SEC[INTERNAL_PROP].LS.module)
			throw new Error(`${LIB}›listenToErrorEvents() must only be called in the context of an app! (who are you to mess with globals, lib author??)`)

		const sub_SEC = SEC.child({operation: '(uncaught error via window.addEventListener)'})

		const catchFn = createCatcher({
			decorators: sub_SEC[INTERNAL_PROP].errDecorators,
			onError: sub_SEC[INTERNAL_PROP].onError,
			debugId: 'browser/errorEvent',
		})

		window.addEventListener('error', function(evt) {
			// https://developer.mozilla.org/en-US/docs/Web/API/ErrorEvent
			console.log('SEC browser debug: error event', arguments) // TODO analyze
			const err = (evt && evt.message === 'Script error.')
				? new Error(`Error from another origin!`)
				: evt.error || new Error(`Error "${evt.message}" from "${evt.filename}", line ${evt.lineno}.${evt.colno}!`)
			catchFn(err)
			evt.preventDefault(); // XXX should we?
		});
	}

	function listenToUnhandledRejections() {
		if (!SEC[INTERNAL_PROP].LS.module)
			throw new Error(`${LIB}›listenToUnhandledRejections() must only be called in the context of an app! (who are you to mess with globals, lib author??)`)

		const sub_SEC = SEC.child({operation: '(uncaught promise rejection via window.onunhandledrejection)'})

		const catchFn = createCatcher({
			decorators: sub_SEC[INTERNAL_PROP].errDecorators,
			onError: sub_SEC[INTERNAL_PROP].onError,
			debugId: 'browser/onError',
		})

		window.onunhandledrejection = function(evt) {
			// https://developer.mozilla.org/en-US/docs/Web/API/PromiseRejectionEvent
			console.log('SEC browser debug: onunhandledrejection', arguments) // TODO analyze
			const err = evt.reason || new Error(`Error: uncaught promise rejection!`)
			catchFn(err)
			return true; // same as preventDefault XXX should we?
		};
	}

	function listenToAll() {
		//listenToErrors()
		listenToErrorEvents()
		listenToUnhandledRejections()
	}

	// TODO inject NODE_ENV

	return {
		...SEC,
		listenToErrors,
		listenToErrorEvents,
		listenToUnhandledRejectionsEvents: listenToUnhandledRejections,
		listenToAll,
	}
}

const browser = {
	create,
}

export {
	isSEC,
	setRoot,
	getContext,

	browser,
}
