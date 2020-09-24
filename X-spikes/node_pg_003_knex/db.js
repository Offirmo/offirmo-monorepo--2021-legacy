const knex = require('knex')

const connection = {
	host: '127.0.0.1',
	port: 32768,
	database: 'postgres',
	user: 'postgres',
}

function get_db() {
	return knex({
		client: 'pg',
		connection,
		//searchPath: ['knex', 'public'],
		debug: true, // TODO remove
		// log: TODO
		pool: {
			min: 1, max: 1,
			afterCreate: (conn, done) => {
				// in this example we use pg driver's connection API
				conn.query('SET timezone="UTC";', function (err) {
					done(err, conn)
				})
			}
		}
	})
}

module.exports = get_db
