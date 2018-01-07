
const { createLogger } = require('..')

const logger = createLogger({
	name: 'FOO',
	level: 'silly',
})

logger.log('hello')
