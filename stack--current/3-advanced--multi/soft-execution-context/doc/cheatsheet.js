const stylizeString = require('@offirmo/cli-toolbox/string/stylize')
const boxify = require('@offirmo/cli-toolbox/string/boxify')

const PKG_JSON = require('../package.json')

console.log(boxify(`
const { getRootSEC } = require('${stylizeString.bold(PKG_JSON.name)}')

const SEC = getRootSEC()
SEC.setLogicalStack({
	module: APP,
})
SEC.injectDependencies({
	logger: console,
})
SEC.setAnalyticsDetails({
SEC.setAnalyticsAndErrorDetails({
	v: '2.3',
})
SEC.emitter.on('final-error', function onError({err}) {
	logger.fatal('error!', {err})
})
SEC.emitter.on('analytics', function onAnalyticsEvent({eventId, details}) {
	...
})

const { ENV } = SEC.getInjectedDependencies()
SEC.listenToUncaughtErrors()
SEC.listenToUnhandledRejections()
logger.trace('Soft Execution Context initialized.')

SEC.xTryCatch('starting', ({SEC, logger, ENV}) => {
	logger.trace({ENV})
	SEC.fireAnalyticsEvent(eventId, details)
	...
})

xTry,
xTryCatch,
xPromiseTry,
xPromiseCatch,
xPromiseTryCatch,
`.trim()))


////////

console.log(boxify(`
import { getRootSEC } from '${stylizeString.bold(PKG_JSON.name)}'

const LIB = 'FOO'

function get_lib_SEC(parent) {
	return (parent ?? getRootSEC())
		.createChild()
		.setLogicalStack({module: LIB})
}

function hello(target, {SEC} = {}) {
	get_lib_SEC(SEC).xTry('hello', ({SEC, logger}) => {
		...
	})
}

export {
	LIB,
	hello,
}
`.trim()))
