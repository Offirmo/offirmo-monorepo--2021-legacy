const knex = require('knex')
const assert = require('tiny-invariant')

// https://knexjs.org/


const db = require('./db')()

async function get_full_user_through_netlify(netlify_id) {
	return db
		.select(db.raw('row_to_json("users__netlify".*) AS "netlify_user", row_to_json("users".*) AS "user"')).from('users')
		.fullOuterJoin('users__netlify', {'users.id': 'users__netlify.user_id'})
		.where('users__netlify.own_id', netlify_id)
		.then(result => {
			if (!result || !result.length)
				return null

			//console.log('outer join result', result)
			const raw_u = result[0].user
			const raw_nu = result[0].netlify_user
			const merged = {
				created_at: raw_u.created_at,
				id: raw_u.id,
				called: raw_u.called || raw_nu.called || 'anonymous',
				email: raw_u.email || raw_nu.email,
				avatar_url: raw_u.avatar_url || raw_nu.avatar_url,
				roles: Array.from(new Set([...raw_u.roles, ...raw_nu.roles])),
			}
			//const [ user, netlify_user ] = result
			return merged
		})
}

async function create_user(called, email, avatar_url, roles = [], trx = db) {
	return trx('users')
		.insert({ called, email, avatar_url, roles })
		.returning('id')
		.then(([id]) => id)
}

async function create_netlify_user(user_id, netlify_id, called, email, avatar_url, roles, trx = db) {
	assert(user_id)
	return trx('users__netlify')
		.insert({ own_id: netlify_id, user_id, called, email, avatar_url, roles })
}

async function create_user_through_netlify(netlify_id, called, email, avatar_url, roles) {
	let id
	return db.transaction(trx =>
		create_user(called, email, avatar_url, roles, trx)
			.then(user_id =>
				create_netlify_user(user_id, netlify_id, called, email, avatar_url, roles, trx)
			)
			.then(trx.commit)
			.catch(trx.rollback)
			.then(() => undefined)
	)
}

;(async () => {
	//const netlify_id = 'xxx-demo-admin-netlify-id-xxx'
	const netlify_id = 'foobar2'

	return get_full_user_through_netlify(netlify_id)
		.then(result => {
			console.log('get_full_user_through_netlify #1', {result})
			if (!result) {
				console.log('not found, creating a new user...')
				return create_user_through_netlify(netlify_id)
					.then(() => get_full_user_through_netlify(netlify_id))
					.then(result => {
						console.log('get_full_user_through_netlify #2', {result})
						return result
					})
			}
			return result
		})
		.then(result => {
			console.log('got the full user:', result)
		})
})()
	.catch(console.error)
	.finally(() => db.destroy())
