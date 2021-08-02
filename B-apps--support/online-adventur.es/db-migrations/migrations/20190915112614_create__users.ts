import { Knex } from 'knex'

////////////////////////////////////

export const NAME = 'users'

////////////////////////////////////

export async function up(knex: Knex): Promise<any> {
	return knex.schema.createTable(NAME, table => {
		table
			.timestamps(true, true)

		table
			.increments('id').primary()

		table
			.string('called')

		table
			.string('raw_email') // as entered by the user (not cleaned)
			.unique()
			.index()

		table
			.string('normalized_email') // maximally cleaned = used as a unique id
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
