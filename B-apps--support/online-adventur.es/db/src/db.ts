import tiny_singleton from '@offirmo/tiny-singleton'
import { knex } from 'knex'
//import { parse } from 'pg-connection-string'
import { overrideHook } from '@offirmo/universal-debug-api-placeholder'

import logger from './utils/logger'

// Defaults
// https://hub.docker.com/_/postgres
const DEFAULT_DOCKER_PG_USER = 'postgres'
const DEFAULT_DOCKER_DB_NAME = DEFAULT_DOCKER_PG_USER
const DEFAULT_PG_PORT = 5432

// actual config
const PG_USER = DEFAULT_DOCKER_PG_USER
const PG_DB_NAME = DEFAULT_DOCKER_DB_NAME
const PG_PORT = DEFAULT_PG_PORT // exposed through image settings
const PG_PWD = 'password' // set through ENV VAR

const LOCAL_DEV_CNX_STR = `postgres://${PG_USER}:${PG_PWD}@localhost:${PG_PORT}/${PG_DB_NAME}`


export function get_connection_string(): string {
	return process.env.SECRET_DATABASE_URL || LOCAL_DEV_CNX_STR
}

export const get_db = tiny_singleton(({min = 1, max = 1}: {min?: number, max?: number} = {}) => {
	logger.trace('get_db() called')

	const db = knex({
		client: 'pg',
		connection: get_connection_string(),
		debug: Boolean(overrideHook('knex-debug', true)), // TODO change default and improve the coercion
		log: {
			warn(message: Object) {
				logger.warn('from knex', message)
			},
			error(message: Object) {
				logger.error('from knex', message)
			},
			deprecate(message: Object) {
				logger.warn('from knex: deprecated', message)
			},
			debug(message: Object) {
				logger.debug('from knex', message)
			},
		},
		pool: {
			min,
			max,
			//idleTimeoutMillis: 100, no, not good in function env.
			// we want to keep the connexion alive between calls if possible

			// https://knexjs.org/#Installation-pooling-afterCreate
			afterCreate: (rawConn: any, done: any) => {
				logger.info('knex connection acquired ✔')
				done(undefined, rawConn)
			},
		},

		acquireConnectionTimeout: get_connection_string() === LOCAL_DEV_CNX_STR
			// in our function env, we can't wait too long
			? 1000 // local should be fast
			: 5000,

		// https://knexjs.org/#Installation-post-process-response
		postProcessResponse: (result: any, queryContext: any) => {
			//logger.info('knex got a response', result)
			return result
		},
	})

	return db
})

export default get_db
