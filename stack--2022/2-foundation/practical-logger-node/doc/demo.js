#!/bin/sh
':' //# https://sambal.org/?p=1014 ; exec `dirname $0`/../../../../node_modules/.bin/babel-node "$0" "$@"
'use strict'

const { createLogger } = require('..')

const logger_trivial = createLogger()
logger_trivial.log('trivial log test!')
logger_trivial.error('trivial error test!')

const {
	demo_legacy_console,
	demo_logger_basic_usage,
	demo_logger_levels,
	demo_error,
	demo_group,
	demo_incorrect_logger_invocations,
	demo_logger_api,
	demo_devtools_fonts,
} = require('../../practical-logger-core/doc/shared-demo')

const logger = createLogger({
	name: 'demo',
	suggestedLevel: 'silly',
})
//logger.fatal('test!')

demo_legacy_console()
demo_logger_api(createLogger)

demo_logger_basic_usage(logger)
demo_logger_levels(logger)
//demo_error(console)
//demo_error(logger)
//demo_group(logger)
demo_incorrect_logger_invocations(logger)
//demo_devtools_fonts(logger)

