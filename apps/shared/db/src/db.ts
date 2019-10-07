import tiny_singleton from '@offirmo-private/tiny-singleton'
import Knex from 'knex'

export const get_db = tiny_singleton(() => Knex({
		client: 'pg',
		connection: process.env.SECRET_DATABASE_URL || 'postgres://postgres:@127.0.0.1:32768/postgres',
		debug: true, // TODO remove
		// log: TODO
		pool: {
			min: 1, max: 1,
			/*afterCreate: (conn, done) => {
				// in this example we use pg driver's connection API
				conn.query('SET timezone="UTC";', function (err) {
					done(err, conn)
				});
			}*/
		}
	}))

export default get_db
