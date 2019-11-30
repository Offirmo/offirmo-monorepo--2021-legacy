import * as Knex from 'knex'

import { NAME as USERS_TABLE } from './20190915112614_create-users'
import { NAME as NETLIFY_USERS_TABLE } from './20190915181842_create-netlify-users'

export async function up(knex: Knex): Promise<any> {
	await knex(USERS_TABLE).insert(
		{
			id: 0,
			called: 'Admin',
			usual_email: 'offirmo.net@gmail.com',
			normalized_email: 'offirmonet@gmail.com',
			roles: [ 'admin', 'tbrpg:admin']
		},
	)
	await knex(NETLIFY_USERS_TABLE).insert(
		{
			own_id: '546d79ab-5240-4dd0-af66-782afbc0a044',
			user_id: 0,
		},
	)
}


export async function down(knex: Knex): Promise<any> {
	return knex(USERS_TABLE).where({ 'id': 1 }).del()
}
