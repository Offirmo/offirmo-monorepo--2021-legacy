
// http://knexjs.org/#Migrations
// knex init -x ts
// knex migrate:make migration_name -x ts
// knex migrate:latest
// knex migrate:rollback --all


//
const db = require('./db')()

const test = db.schema.createTable('test', function (table) {
	table.increments();
	table.string('name');
	table.timestamps();
})

console.log(test)
