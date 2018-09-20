#!/bin/sh
':' //# http://sambal.org/?p=1014 ; exec `dirname $0`/../../../../node_modules/.bin/babel-node "$0" "$@"
'use strict'

const { ALL_LOG_LEVELS } = require('@offirmo/practical-logger-core')
const { createLogger } = require('..')

const logger = createLogger({
	name: 'FOO',
	level: 'silly',
})

ALL_LOG_LEVELS.forEach(level =>
	logger[level](`msg with level "${level}"`)
)

