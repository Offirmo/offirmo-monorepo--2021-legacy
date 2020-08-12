import * as Knex from 'knex'

////////////////////////////////////

export const NAME = 'kvs'

////////////////////////////////////

export async function up(knex: Knex): Promise<any> {
	return knex.schema.createTable(NAME, table => {
		table
			.timestamps(true, true)

		table
			.integer('user_id')
			.unsigned()
			.notNullable()
			.references('id').inTable('users').onDelete('CASCADE')
			.index()

		table
			.string('key')
			.notNullable()
			.index()

		table
			.unique(['user_id', 'key'])

		table
			.jsonb('value')
			.notNullable()

		table
			.jsonb('bkp')

		table
			.jsonb('v-1')

		table
			.jsonb('v-2')
	})
}


export async function down(knex: Knex): Promise<any> {
	return knex.schema.dropTableIfExists(NAME)
}
