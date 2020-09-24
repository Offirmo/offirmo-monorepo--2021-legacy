// Update with your config settings.

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

const LOCAL_DEV_CNX_STR = `postgres://${PG_USER}:${PG_PWD}@127.0.0.1:${PG_PORT}/${PG_DB_NAME}`


const COMMON_KNEX_CONFIG = {
	client: 'pg',
	/*pool: {
		min: 1,
		max: 10
	},
	migrations: {
		tableName: "knex_migrations"
	}*/
}

module.exports = {

	development: {
		...COMMON_KNEX_CONFIG,
		connection: LOCAL_DEV_CNX_STR,
	},

	staging: {
		...COMMON_KNEX_CONFIG,
		connection: process.env.SECRET_DATABASE_URL,
	},

	production: {
		...COMMON_KNEX_CONFIG,
		connection: process.env.SECRET_DATABASE_URL,
	},

}
