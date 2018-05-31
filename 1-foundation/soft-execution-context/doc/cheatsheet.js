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
SEC.emitter.on('final-error', function onError(err) {
	logger.fatal('error!', {err})
})

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
