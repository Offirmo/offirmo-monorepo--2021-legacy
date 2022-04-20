import * as Knex from "knex"

export const NAME = 'users'

// postgres array:
// https://stackoverflow.com/questions/50118196/how-to-insert-array-data-type-using-knex-and-potsgres

export async function up(knex: Knex): Promise<any> {
	return knex.schema.createTable(NAME, table => {
		table.increments('id').primary()

		table.timestamps(true, true)

		table.string('called')

		table.string('email')

		table
			.string('avatar_url')

		table
			.specificType('roles', 'text[]')
			.notNullable()
	})
}


export async function down(knex: Knex): Promise<any> {
	return knex.schema.dropTableIfExists(NAME)
}
