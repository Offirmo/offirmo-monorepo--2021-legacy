// Update with your config settings.

module.exports = {

	development: {
		client: "postgresql",
		connection: 'postgres://postgres:@127.0.0.1:32768/postgres',
		/*connection: {
			host: '127.0.0.1',
			port: 32768,
			database: 'postgres',
			user: 'postgres',
		},*/
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: "knex_migrations"
		}
	},

	staging: {
		client: "postgresql",
		connection: {
			database: "my_db",
			user: "username",
			password: "password"
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: "knex_migrations"
		}
	},

	production: {
		client: "postgresql",
		connection: {
			database: "my_db",
			user: "username",
			password: "password"
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: "knex_migrations"
		}
	}

};
