import tiny_singleton from '@offirmo/tiny-singleton'
import Knex from 'knex'
import { overrideHook } from '@offirmo/universal-debug-api-placeholder'

import logger from './utils/logger'

const DEFAULT_CNX_STR = 'postgres://postgres:password@127.0.0.1:32770/postgres'

export function get_connection_string(): string {
	return process.env.SECRET_DATABASE_URL || DEFAULT_CNX_STR
}

export const get_db = tiny_singleton(({min = 1, max = 1}: {min?: number, max?: number} = {}) => Knex({
		client: 'pg',
		connection: get_connection_string(),
		debug: overrideHook('knex-debug', true), // TODO change default
		log: {
			warn(message: Object) {
				logger.warn('from knex', message)
			},
			error(message: Object) {
				logger.error('from knex', message)
			},
			deprecate(message: Object) {
				logger.info('from knex: deprecated', message)
			},
			debug(message: Object) {
				logger.trace('from knex', message)
			},
		},
		pool: {
			min,
			max,
			//idleTimeoutMillis: 100, no, not good in function env.
			                          // we want to keep the connexion alive between calls if possible
			afterCreate: (rawConn: any, done: any) => {
				logger.info('knex connection acquired ✔')
				done(undefined, rawConn)
			},
		},
		acquireConnectionTimeout: get_connection_string() === DEFAULT_CNX_STR
			// in our function env, we can't wait too long
			? 1000 // local should be fast
			: 5000,
	}))

export default get_db
