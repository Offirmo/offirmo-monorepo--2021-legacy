'use strict'

const { improve_console_groups } = require('../..')

const {
	demo_group,
} = require('../../../../2-foundation/practical-logger-core/doc/shared-demo')

console.log('starting...', { improve_console_groups })

console.log('XXX Before improvement XXX')
demo_group(console)

improve_console_groups({lazy: true})
improve_console_groups({lazy: false})
improve_console_groups()

console.log('XXX After improvement XXX')
demo_group(console)
