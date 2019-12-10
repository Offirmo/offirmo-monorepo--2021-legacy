const knex = require('knex')

// XXX env
const connection = {
	host: '127.0.0.1',
	port: 32768,
	database: 'postgres',
	user: 'postgres',
}

export default function get_db() {
	return knex({
		client: 'pg',
		connection,
		debug: true,
		// log: TODO
	});
}
