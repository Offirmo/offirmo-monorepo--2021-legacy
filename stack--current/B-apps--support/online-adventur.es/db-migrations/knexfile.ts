// Update with your config settings.

// Defaults
const DEFAULT_PG_PORT = 5432
// https://hub.docker.com/_/postgres
const DEFAULT_DOCKER_PG_USER = 'postgres'
const DEFAULT_DOCKER_DB_NAME = DEFAULT_DOCKER_PG_USER

// actual config
const LOCAL_DEV_CNX_STR = (() => {
	const DEV_PG_USER = DEFAULT_DOCKER_PG_USER
	const DEV_PG_DB_NAME = DEFAULT_DOCKER_DB_NAME
	const DEV_PG_PORT = DEFAULT_PG_PORT // exposed through image settings
	const DEV_PG_PWD = 'password' // set through ENV VAR

	return `postgres://${DEV_PG_USER}:${DEV_PG_PWD}@127.0.0.1:${DEV_PG_PORT}/${DEV_PG_DB_NAME}`
})()


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
