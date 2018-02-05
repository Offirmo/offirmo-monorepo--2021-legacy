const stylizeString = require('@offirmo/cli-toolbox/string/stylize')
const boxify = require('@offirmo/cli-toolbox/string/boxify')

const PKG_JSON = require('../package.json')

console.log(boxify(`
import { ItemQuality } from '${stylizeString.bold(PKG_JSON.name)}'

function onError(err) { console.error('error!', {err}) }


const SEC = soft_execution_context.node.create({
   [ parent: ..., ]
   module: 'the-npm-rpg',
   onError,         <- inherited from parent if needed
   defaultContext: {},
   context: {
      env: 'development',                <- default
      logger: compatibleLoggerToConsole, <- default
      logicalStack,                      <- forced
      tracePrefix,                       <- forced
   }
})
soft_execution_context.setRoot(SEC)

SEC.listenToUncaughtErrors()
SEC.listenToUnhandledRejections()
logger.trace('Soft Execution Context initialized.')
`.trim()))



const { ItemQuality } = require('@offirmo/practical-logger-core')

const data = ALL_LOG_LEVELS.map(level => LEVEL_TO_STYLIZE[level](level))
console.log(boxify('Log levels:\n' + columnify(data, {
	sort: false,
	width: 70,
})))
