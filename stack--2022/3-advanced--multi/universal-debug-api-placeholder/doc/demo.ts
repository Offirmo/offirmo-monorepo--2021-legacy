#!/bin/sh
':' //# https://sambal.org/?p=1014 ; exec `dirname $0`/../node_modules/.bin/ts-node "$0" "$@"

const { getLogger, addDebugCommand } = require('..')

console.log('Nothing should be displayed:')

const root_logger = getLogger()
root_logger.fatal('Hello')

const logger = getLogger('foo')
logger.fatal('Hello')

addDebugCommand('foo', () => {})
