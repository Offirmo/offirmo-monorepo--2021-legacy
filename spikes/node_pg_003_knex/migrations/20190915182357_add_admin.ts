import * as Knex from "knex";

import { NAME as USERS_TABLE } from './20190915112614_create-users'
import { NAME as NETLIFY_USERS_TABLE } from './20190915181842_create-netlify-users'

export async function up(knex: Knex): Promise<any> {
	return knex(USERS_TABLE).insert(
			{
				id: 1,
				called: 'Admin',
				email: 'offirmo.net@gmail.com',
				roles: [ 'admin', 'tbrpg:admin']
			},
		)
		.then(() => {
			return knex(NETLIFY_USERS_TABLE).insert(
				{
					netlify_id: '546d79ab-5240-4dd0-af66-782afbc0a044',
					user_id: 1,
					roles: []
				},
			)
		})
}


export async function down(knex: Knex): Promise<any> {
	return knex(USERS_TABLE).where({ 'id': 1 }).del()
}
