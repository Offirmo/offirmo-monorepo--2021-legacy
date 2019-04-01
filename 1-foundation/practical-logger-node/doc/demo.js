#!/bin/sh
':' //# http://sambal.org/?p=1014 ; exec `dirname $0`/../../../../node_modules/.bin/babel-node "$0" "$@"
'use strict'

const { ALL_LOG_LEVELS } = require('@offirmo-private/practical-logger-core')
const { createLogger } = require('..')

const logger = createLogger({
	name: 'FOO',
	suggestedLevel: 'silly',
})

const err = new Error('Some Error!')
err.httpStatus = 418 // to check that custom props are preserved

const bob = {
	firstName: 'Bob',
	lastName: 'Dupont',
	age: 42,
}
const more = 'some stuff'

// standard
console.log('------------')
logger.log('hello')
logger.log('Bob created', { user: bob })
logger.error(undefined, err)

// all levels
console.log('------------')
ALL_LOG_LEVELS.forEach(level =>
	logger[level](`test msg with level "${level}"`, { level })
)

// incorrect - bunyan
console.log('------------')
logger.info()

logger.info('hi')
logger.info('hi %s', bob, more)

logger.info({foo: 'bar'}, 'hi')

logger.info(err)
logger.info(err, 'more on this: %s', more)

logger.info({foo: 'bar', err: err}, 'some msg about this error')
logger.warn('foo', 'bar', 42)
