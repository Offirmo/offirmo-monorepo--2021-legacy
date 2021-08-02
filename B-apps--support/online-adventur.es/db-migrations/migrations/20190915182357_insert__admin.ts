import { Knex } from 'knex'
import { NORMALIZERS} from '@offirmo-private/normalize-string'

import { NAME as USERS_TABLE } from './20190915112614_create__users'
import { NAME as NETLIFY_USERS_TABLE } from './20190915181842_create__users__netlify'

////////////////////////////////////

const ADMIN_EMAIL = 'offirmo.net@gmail.com'

////////////////////////////////////

export async function up(knex: Knex): Promise<any> {
	await knex(USERS_TABLE).insert(
		{
			id: 0,
			called: 'Admin',
			raw_email: NORMALIZERS.normalize_email_reasonable(ADMIN_EMAIL),
			normalized_email: NORMALIZERS.normalize_email_full(ADMIN_EMAIL),
			roles: [ 'admin', 'tbrpg:admin']
		},
	)
	// 2020/09/19 note: this is useless!
	/*await knex(NETLIFY_USERS_TABLE).insert(
		{
			// 2020/09/19 note: also seems the id changed
			own_id: '546d79ab-5240-4dd0-af66-782afbc0a044',
			user_id: 0,
		},
	)*/
}


export async function down(knex: Knex): Promise<any> {
	return knex(USERS_TABLE).where({ 'id': 0 }).del()
}
