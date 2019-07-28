'use strict'

const { improve_console_groups } = require('../..')

const {
	demo_group,
} = require('../../../../1-foundation/practical-logger-core/doc/shared-demo')

console.log('starting...', { improve_console_groups })

demo_group(console)

improve_console_groups()

demo_group(console)
