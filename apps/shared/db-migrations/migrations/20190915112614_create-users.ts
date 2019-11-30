import * as Knex from 'knex'

export const NAME = 'users'

// postgres array:
// https://stackoverflow.com/questions/50118196/how-to-insert-array-data-type-using-knex-and-potsgres

export async function up(knex: Knex): Promise<any> {
	return knex.schema.createTable(NAME, table => {
		table
			.timestamps(true, true)

		table
			.increments('id').primary()

		table
			.string('called')

		table
			.string('usual_email')
			.unique()
			.index()

		table
			.string('normalized_email')
			.unique()
			.index()

		table
			.string('avatar_url')

		table
			.specificType('roles', 'text[]')
			.notNullable()
			.defaultTo(knex.raw('array[]::varchar[]'))
	})
}


export async function down(knex: Knex): Promise<any> {
	return knex.schema.dropTableIfExists(NAME)
}
