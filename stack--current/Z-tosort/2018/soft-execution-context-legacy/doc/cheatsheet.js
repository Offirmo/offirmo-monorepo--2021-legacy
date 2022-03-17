const stylizeString = require('@offirmo/cli-toolbox/string/stylize')
const boxify = require('@offirmo/cli-toolbox/string/boxify')

const PKG_JSON = require('../package.json')

console.log(boxify(`
const soft_execution_context = require('${stylizeString.bold(PKG_JSON.name)}')

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


////////

console.log(boxify(`
const soft_execution_context = require('${stylizeString.bold(PKG_JSON.name)}')

function create({SEC} = {}) {
   SEC = soft_execution_context.isomorphic.create({parent: SEC, module: LIB})

   return SEC.xTryCatch(\`doing \${xyz}\`, ({logger, env}) => {
      logger.trace({env})
      ...
   })
}

xTry,
xTryCatch,
xPromiseTry,
xPromiseCatch,
xPromiseTryCatch,
`.trim()))
