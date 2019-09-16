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
		debug: true,
		// log: TODO
	});
}

module.exports = get_db
