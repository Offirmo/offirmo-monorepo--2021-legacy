import { Immutable } from '@offirmo-private/ts-types'
import { enforce_immutability } from '@offirmo-private/state-utils'

import { NetlifyUser, BaseUser, PNetlifyUser } from './types'
import { delete_by_email } from './delete'
import { WithoutTimestamps } from '../types'
import get_db from '../db'

////////////////////////////////////

export const TEST_NETLIFY_ID: PNetlifyUser['own_id'] = 'netlify-#foo'
export const TEST_NETLIFY_ID_ALT: PNetlifyUser['own_id'] = 'netlify-#bar'

// test data is intentionally "rough"
export const EMAIL_01 = 'Test01@Gmail. Com'
export const EMAIL_01_ALT = 'Test01+foo@Gmail. Com' // same email but netlify doesn't realize it
export const CALLED_01 = 'The Tester 01 '
export const EMAIL_02 = 'foo@bar.com'
export const CALLED_02 = 'The Tester 02'

/////////////////////

export function get_test_netlify_user_01(p: Partial<Immutable<NetlifyUser>> = {}): Immutable<NetlifyUser> {
	// data is intentionally "rough"
	return enforce_immutability({
		netlify_id: TEST_NETLIFY_ID,
		full_name: CALLED_01,
		email: EMAIL_01,
		avatar_url: undefined,
		roles: [ 'test' ],
		provider: 'unit-tests--users--test-provider',
		...p,
	})
}
export function get_test_netlify_user_01_alt(p: Partial<Immutable<NetlifyUser>> = {}): Immutable<NetlifyUser> {
	// data is intentionally "rough"
	return enforce_immutability({
		netlify_id: TEST_NETLIFY_ID_ALT,
		full_name: CALLED_01,
		email: EMAIL_01_ALT,
		avatar_url: undefined,
		roles: [ 'test' ],
		provider: 'unit-tests--users--test-provider',
		...p,
	})
}

export function get_test_base_user_01(p: Partial<Immutable<BaseUser>> = {}): Immutable<BaseUser> {
	return enforce_immutability({
		called: CALLED_01,
		raw_email: EMAIL_01,
		normalized_email: undefined,
		avatar_url: undefined,
		roles: [ 'test' ],
		...p,
	})
}
export function get_test_base_user_02(p: Partial<Immutable<BaseUser>> = {}): Immutable<BaseUser> {
	return enforce_immutability({
		called: CALLED_02,
		raw_email: EMAIL_02,
		normalized_email: undefined,
		avatar_url: undefined,
		roles: [ 'test' ],
		...p,
	})
}

export function get_test_base_netlify_user(user_id: number, netlify_id: string = TEST_NETLIFY_ID): Immutable<WithoutTimestamps<PNetlifyUser>> {
	return enforce_immutability({
		user_id,
		own_id: netlify_id
	})
}

export async function cleanup() {
	//console.log('>>> user create test cleanup')
	// REM: this will cascade users--xxx deletion
	await delete_by_email(get_test_base_user_01().raw_email)
	await delete_by_email(get_test_base_user_02().raw_email)
}

////////////////////////////////////

// https://github.com/Vincit/objection.js/issues/534#issuecomment-334258236
after(async () => {
	//await cleanup()
	console.log('* All tests ended, terminating knex…')
	await get_db().destroy()
})
