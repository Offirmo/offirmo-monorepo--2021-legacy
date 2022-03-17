const assert = require('tiny-invariant')

// https://knexjs.org/

const db = require('./db')()

async function get_full_user_through_netlify(netlify_id) {
	const raw_result = await db
		.select(db.raw('row_to_json("users__netlify".*) AS "netlify_user", row_to_json("users".*) AS "user"')).from('users')
		.fullOuterJoin('users__netlify', {'users.id': 'users__netlify.user_id'})
		.where('users__netlify.own_id', netlify_id)

		if (!raw_result || !raw_result.length)
			return null

		//console.log('outer join raw result', raw_result)
		const raw_u = raw_result[0].user
		const raw_nu = raw_result[0].netlify_user

		const merged = {
			created_at: raw_u.created_at,
			id: raw_u.id,
			called: raw_u.called || raw_nu.called || 'anonymous',
			email: raw_u.email || raw_nu.email,
			avatar_url: raw_u.avatar_url || raw_nu.avatar_url,
			roles: Array.from(new Set([...raw_u.roles, ...raw_nu.roles])),
		}
		return merged
}

async function create_user(called, email, avatar_url, roles = [], trx = db) {
	const [ id ] = await trx('users')
		.insert({ called, email, avatar_url, roles })
		.returning('id')

	return id
}

async function create_netlify_user(user_id, netlify_id, called, email, avatar_url, roles, trx = db) {
	await trx('users__netlify')
		.insert({ own_id: netlify_id, user_id, called, email, avatar_url, roles })
}

async function create_user_through_netlify(netlify_id, called, email, avatar_url, roles) {
	return db.transaction(async trx => {
			const user_id = await create_user(called, email, avatar_url, roles, trx)
			return create_netlify_user(user_id, netlify_id, called, email, avatar_url, roles, trx)
				.then(trx.commit)
				.then(() => undefined)
				.catch(err => {
					trx.rollback(err)
					throw err
				})
		}
	)
}

async function ensure_user_through_netlify(netlify_id, called, email, avatar_url, roles) {
	let result = await get_full_user_through_netlify(netlify_id)
	if (result) console.log('get_full_user_through_netlify #1', {result})

	if (!result) {
		// rare case of 1st time play
		console.log('not found, creating a new user...')
		await create_user_through_netlify(netlify_id, called, email, avatar_url, roles)

		result = await get_full_user_through_netlify(netlify_id)
		console.log('get_full_user_through_netlify #2', {result})
	}

	assert(result)

	return result
}


;(async () => {
	//const netlify_id = 'xxx-demo-admin-netlify-id-xxx'
	const netlify_id = 'foobar'

	const full_user = await ensure_user_through_netlify(netlify_id)

	console.log('got the full user:', full_user)
})()
	.catch(console.error)
	.finally(() => db.destroy())
