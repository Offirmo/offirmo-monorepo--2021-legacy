
const { ALL_LOG_LEVELS } = require('@offirmo/practical-logger-core')
const { createLogger } = require('..')

const logger = createLogger({
	name: 'FOO',
	level: 'silly',
})

ALL_LOG_LEVELS.forEach(level =>
	logger[level](`msg with level ${level}`)
)

