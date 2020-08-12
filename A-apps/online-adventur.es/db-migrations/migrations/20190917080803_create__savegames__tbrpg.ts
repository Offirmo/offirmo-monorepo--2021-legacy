import * as Knex from 'knex'

////////////////////////////////////

export const NAME = 'savegames__tbrpg'

////////////////////////////////////

export async function up(knex: Knex): Promise<any> {
	return knex.schema.createTable(NAME, table => {
		table
			.timestamps(true, true)

		table
			.increments('id')
			.primary()

		table
			.integer('user_id')
			.unsigned()
			.notNullable()
			.references('id').inTable('users').onDelete('CASCADE')
			.index()

		table
			.string('user_private_nickname')
			.notNullable()
			.index()

		table
			.string('user_public_nickname')
			.index()

		table
			.string('summary')
			.notNullable()

		table
			.jsonb('latest')
			.notNullable()

		table
			.jsonb('v-1')

		table
			.jsonb('v-2')

		table
			.jsonb('last_untouched')
			.notNullable()
	})
}


export async function down(knex: Knex): Promise<any> {
	return knex.schema.dropTableIfExists(NAME)
}
