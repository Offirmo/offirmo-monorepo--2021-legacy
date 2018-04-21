
//import NanoEvents from 'nanoevents'  TODO ?

import { LIB, INTERNAL_PROP } from './constants'

import { promiseTry } from '@offirmo/promise-try'
import { normalizeError } from '@offirmo/normalize-error'
import { createCatcher } from './catch-factory'
import { installPluginLogicalStack } from './plugins/logical-stack'
import { installPluginDependencyInjection, getContext } from './plugins/dependency-injection'

function isSEC(SEC) {
	return (SEC && SEC[INTERNAL_PROP])
}

let rootSEC = null
function setRoot(SEC) {
	if (!isSEC(SEC))
		throw new Error(`${LIB}›setRoot() argument error: must be a valid SEC!`)
	if (rootSEC)
		throw new Error(`${LIB}›setRoot() conflict, root already set!`)

	rootSEC = SEC
}

function create(args = {}) {
	if (args.parent && !isSEC(args.parent))
		throw new Error(`${LIB}›create() argument error: parent must be a valid SEC!`)

	const hasNonRootParent = !!args.parent
	args.parent = args.parent || rootSEC

	const onError = args.onError || (args.parent && args.parent.onError) // XXX inherit, really?

	let SEC = {
		[INTERNAL_PROP]: {
			hasNonRootParent,
			//parent,
			//onError,
			errDecorators: [ normalizeError ],
			state: {}, // TODO
			DI: {
				context: {}
			},
		},

		child,

		xTry,
		xTryCatch,
		xPromiseTry,
		xPromiseCatch,
		xPromiseTryCatch,
	}

	// TODO rationalize
	// TODO event?
	// TODO lifecycle ?
	//if (SEC.verbose) console.log(`${LIB}: new SEC:`, args)

	SEC = installPluginLogicalStack(SEC, args)
	SEC = installPluginDependencyInjection(SEC, args)

	// TODO check all params were handled!

	/////////////////////

	function child(args) {
		// optim for libs which may call themselves
		// XXX TOCheck
		/*if (isSEC(args) && args[INTERNAL_PROP].module && args[INTERNAL_PROP].module === SEC[INTERNAL_PROP].module) {
			// no need to create a child of oneself
			return SEC
		}*/

		return create({
			...args,
			parent: SEC,
		})
	}

	/////////////////////

	function xTry(operation, fn) {
		const sub_SEC = SEC.child({operation})
		const params = {...sub_SEC[INTERNAL_PROP].DI.context, SEC: sub_SEC}
		try {
			return fn(params)
		}
		catch (err) {
			createCatcher({
				debugId: 'xTry',
				decorators: sub_SEC[INTERNAL_PROP].errDecorators,
				onError: null, //< note this: will rethrow
			})(err)
		}
	}

	function xTryCatch(operation, fn) {
		const sub_SEC = SEC.child({operation})
		const params = {...sub_SEC[INTERNAL_PROP].DI.context, SEC: sub_SEC}
		try {
			return fn(params)
		}
		catch (err) {
			createCatcher({
				debugId: 'xTryCatch',
				decorators: sub_SEC[INTERNAL_PROP].errDecorators,
				onError,
			})(err)
		}
	}

	function xPromiseCatch(operation, promise) {
		const sub_SEC = SEC.child({operation})
		return promise
			.catch(err => {
				createCatcher({
					debugId: 'xPromiseCatch',
					decorators: sub_SEC[INTERNAL_PROP].errDecorators,
					onError,
				})(err)
			})
	}

	function xPromiseTry(operation, fn) {
		const sub_SEC = SEC.child({operation})
		const params = {...sub_SEC[INTERNAL_PROP].DI.context, SEC: sub_SEC}
		return promiseTry(() => fn(params))
			.catch(err => {
				createCatcher({
					debugId: 'xPromiseTry',
					decorators: sub_SEC[INTERNAL_PROP].errDecorators,
					onError: null,
				})(err)
			})
	}

	function xPromiseTryCatch(operation, fn) {
		const sub_SEC = SEC.child({operation})
		const params = {...sub_SEC[INTERNAL_PROP].DI.context, SEC: sub_SEC}
		return promiseTry(() => fn(params))
			.catch(createCatcher({
				debugId: 'xPromiseTryCatch',
				decorators: sub_SEC[INTERNAL_PROP].errDecorators,
				onError,
			}))
	}

	return SEC
}

export {
	isSEC,
	setRoot,
	create,
	getContext,
}
