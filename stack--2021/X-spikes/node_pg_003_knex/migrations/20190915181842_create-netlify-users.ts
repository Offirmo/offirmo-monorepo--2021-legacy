import * as Knex from "knex"

export const NAME = 'users__netlify'

export async function up(knex: Knex): Promise<any> {
	return knex.schema.createTable(NAME, table => {
		table.timestamps(true, true)

		table
			.string('own_id')
			.notNullable()
			.unique()
			.index()

		table
			.integer('user_id')
			.unsigned()
			.notNullable()
			.references('id').inTable('users').onDelete('CASCADE')
			.index()

		table
			.string('email')

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
