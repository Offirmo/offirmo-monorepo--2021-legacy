import * as Knex from "knex"

export const NAME = 'savegames__tbrpg'

export async function up(knex: Knex): Promise<any> {
	return knex.schema.createTable(NAME, table => {
		table.timestamps(true, true)

		table.integer('user_id')
			.unsigned()
			.notNullable()
			.references('id').inTable('users').onDelete('CASCADE')
			.index()

		table.jsonb('savegame')
			.notNullable()
	})
}


export async function down(knex: Knex): Promise<any> {
	return knex.schema.dropTableIfExists(NAME)
}
