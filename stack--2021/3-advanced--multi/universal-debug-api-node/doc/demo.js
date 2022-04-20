const {
	getLogger,
	overrideHook,
	exposeInternal,
	addDebugCommand,
} = require('..')

console.log('Stuff may on may not be displayed:')

const root_logger = getLogger({
	suggestedLevel: 'silly',
})
root_logger.silly('Hello')
root_logger.verbose('Hello')
root_logger.fatal('Hello')

const logger = getLogger({ name: 'foo'})
logger.silly('Hello')
logger.verbose('Hello')
logger.fatal('Hello')

const DB_URL = overrideHook('db-url', 'https://prod.dev:123')
logger.info('DB URL=', {DB_URL})

const user = {
	name: 'John Smith',
}
exposeInternal('user', user)

addDebugCommand('foo', () => {})
