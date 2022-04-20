import * as Knex from 'knex'

import { NAME as USERS_TABLE } from './20190915112614_create-users'
import { NAME as NETLIFY_USERS_TABLE } from './20190915181842_create-netlify-users'

export async function up(knex: Knex): Promise<any> {
	await knex(USERS_TABLE).insert(
			{
				id: 1,
				called: 'Admin',
				email: 'offirmo.net@gmail.com',
				roles: [ 'admin', 'tbrpg:admin']
			},
		)
	await knex(NETLIFY_USERS_TABLE).insert(
			{
				own_id: 'xxx-demo-admin-netlify-id-xxx',
				user_id: 1,
				roles: []
			},
		)
}


export async function down(knex: Knex): Promise<any> {
	return knex(USERS_TABLE).where({ 'id': 1 }).del()
}
