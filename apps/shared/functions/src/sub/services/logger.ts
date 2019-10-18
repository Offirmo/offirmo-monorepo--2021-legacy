'use strict'

import { createLogger as create_core } from '@offirmo/practical-logger-core'
import { createLogger as create_node } from '@offirmo/practical-logger-node'

import { APP } from '../consts'
import { CHANNEL } from './channel'

/////////////////////////////////////////////////

const logger = (CHANNEL === 'dev' ? create_node : create_core)({
	name: APP,
	suggestedLevel: 'silly',
})


logger.notice(`Hello from "${APP}", Logger up with level = ${logger.getLevel()}.`)


export default logger
