import { LIB, INTERNAL_PROP } from './consts'
import { SoftExecutionContext } from './types'
import { ROOT_PROTOTYPE } from './root-prototype'
import * as State from './state'
import { PLUGINS } from './plugins/index'
import { decorateWithDetectedEnv } from './common'

ROOT_PROTOTYPE.createChild = function createChild(args: any) {
	return createSEC({
		...args,
		parent: this,
	})
}

PLUGINS.forEach(PLUGIN => {
	PLUGIN.augment(ROOT_PROTOTYPE)
})

function isSEC(SEC: any): SEC is SoftExecutionContext {
	return (SEC && SEC[INTERNAL_PROP])
}

function createSEC<Injections = {}, AnalyticsDetails = {}, ErrorDetails = {}>(args: any = {}): SoftExecutionContext<Injections, AnalyticsDetails, ErrorDetails> {
	/////// PARAMS ///////

	if (args.parent && !isSEC(args.parent))
		throw new Error(`${LIB}›createSEC() argument error: parent must be a valid SEC!`)

	let unhandled_args = Object.keys(args)

	const SEC = Object.create(ROOT_PROTOTYPE)

	/////// STATE ///////
	const parent_state = args.parent ? args.parent[INTERNAL_PROP] : undefined
	let state = State.create(parent_state)
	unhandled_args = unhandled_args.filter(arg => arg !== 'parent')

	PLUGINS.forEach(PLUGIN => {
		state = State.activate_plugin(state, PLUGIN)
	})

	SEC[INTERNAL_PROP] = state

	// auto injections
	if (!args.parent) {
		SEC.injectDependencies({
			logger: console, // use universal debug API? NO because the placeholder = NOOP = would cause no logs visible by default
		})

		decorateWithDetectedEnv(SEC)
	}
	SEC.injectDependencies({ SEC })

	//console.log('createSEC', SEC, args.parent)

	// Here we could send an event on the SEC bus. No usage for now.
	// Her we could have lifecycle methods. No usage for now.

	if (unhandled_args.length)
		throw new Error(`${LIB}›createSEC() argument error: unknown args: [${unhandled_args.join(',')}]!`)

	/////////////////////

	return SEC
}

export {
	LIB,
	isSEC,
	createSEC,
}
