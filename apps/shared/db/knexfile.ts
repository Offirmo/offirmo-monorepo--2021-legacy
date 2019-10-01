// Update with your config settings.

const COMMON = {
	client: "postgresql",
	pool: {
		min: 2,
		max: 10
	},
	migrations: {
		tableName: "knex_migrations"
	}
}

module.exports = {

	development: {
		...COMMON,
		connection: 'postgres://postgres:@127.0.0.1:32768/postgres',
	},

	staging: {
		...COMMON,
		connection: process.env.SECRET_DATABASE_URL,
	},

	production: {
		...COMMON,
		connection: process.env.SECRET_DATABASE_URL,
	},

};
