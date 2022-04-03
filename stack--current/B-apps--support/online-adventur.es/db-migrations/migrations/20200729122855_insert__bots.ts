const assert = require('assert')
import { Knex } from 'knex'

import { NORMALIZERS} from '@offirmo-private/normalize-string'

import { NAME as USERS_TABLE } from './20190915112614_create__users'

////////////////////////////////////

function get_bot_email(index: number) {
	return `offirmo.net+bot${String(index+1).padStart(2, '0')}@gmail.com`
}
function get_bot_called(index: number) {
	return `Bot-${String(index+1).padStart(2, '0')}`
}
function get_bot_avatar(index: number) {
	// https://randomuser.me/
	assert.ok(index < 10) // only 0-9 available
	return `https://randomuser.me/api/portraits/lego/${index}.jpg`
}

////////////////////////////////////

const BOT_COUNT = 10

export async function up(knex: Knex): Promise<any> {
	return Promise.all(
		Array.from({length: BOT_COUNT}, async (_, index) => {
			const email = get_bot_email(index)

			await knex(USERS_TABLE).insert(
				{
					called: get_bot_called(index),
					raw_email: email,
					normalized_email: NORMALIZERS.normalize_email_safe(email), // NOTE that we don't do a full normalization here
					avatar_url: get_bot_avatar(index),
				},
			)
		})
	)
}


export async function down(knex: Knex): Promise<any> {
	return Promise.all(
		Array.from({ length: BOT_COUNT }, async (_, index) => {
			const email = get_bot_email(index)

			return knex(USERS_TABLE).where({
				normalized_email: NORMALIZERS.normalize_email_safe(email), // NOTE that we don't do a full normalization here,
			}).del()
		})
	)
}
