const stylizeString = require('@offirmo/cli-toolbox/string/stylize')
const boxify = require('@offirmo/cli-toolbox/string/boxify')

const PKG_JSON = require('../package.json')

console.log(boxify(`
const soft_execution_context = require('${stylizeString.bold(PKG_JSON.name)}')

function onError(err) {
   logger.fatal('error!', {err})
}

const SEC = soft_execution_context.node.create({
   module: 'the-npm-rpg',
   onError,
   context: {
      logger,
   }
})
soft_execution_context.setRoot(SEC)

SEC.listenToUncaughtErrors()
SEC.listenToUnhandledRejections()
logger.trace('Soft Execution Context initialized.')
`.trim()))
