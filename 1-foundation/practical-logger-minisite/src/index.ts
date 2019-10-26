import { createLogger } from '@offirmo/practical-logger-browser'

const logger = createLogger()
logger.log('hello from logger!')

const fooLogger = createLogger({
	name: 'Foo',
	suggestedLevel: 'silly',
})
fooLogger.log('hello from fooLogger!', { bar: 42, baz: 33 })
