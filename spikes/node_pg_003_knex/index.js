
// http://knexjs.org/#Migrations
// knex init -x ts
// knex migrate:make migration_name -x ts
// knex migrate:latest
// knex migrate:rollback --all


const db = require('./db')()
//console.log(db)

db.select().from('users')
	.map(function () {
		console.log('result:', Array.from(arguments))
	})
	.catch(console.error)
	.finally(() => db.destroy())


