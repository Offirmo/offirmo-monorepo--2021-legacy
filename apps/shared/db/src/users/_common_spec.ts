import { NetlifyUser, BaseUser, PNetlifyUser } from "./types"
import { delete_user_by_email } from "./delete"
import { WithoutTimestamps } from "../types"
import get_db from "../db"
import { normalize_email_full, normalize_email_reasonable } from '../utils/email'

////////////////////////////////////

export const TEST_NETLIFY_ID: PNetlifyUser['own_id'] = 'netlify-#foo'
const EMAIL_01 = 'Test01@Test. Io'
const CALLED_01 = 'The Tester 01 '

/////////////////////

export function get_test_netlify_user_01(p: Partial<NetlifyUser> = {}): Readonly<NetlifyUser> {
	// data is intentionally "rough"
	return {
		netlify_id: TEST_NETLIFY_ID,
		full_name: CALLED_01,
		email: EMAIL_01,
		avatar_url: undefined,
		roles: [ 'test' ],
		provider: 'foo',
		...p,
	}
}

export function get_test_base_user_01(p: Partial<BaseUser> = {}): Readonly<BaseUser> {
	// data is intentionally "rough"
	return {
		called: CALLED_01,
		usual_email: normalize_email_reasonable(EMAIL_01),
		normalized_email: undefined, //normalize_email_full(EMAIL_01),
		avatar_url: undefined,
		roles: [ 'test' ],
		...p,
	}
}

export function get_test_base_netlify_user(user_id: number, netlify_id: string = TEST_NETLIFY_ID): Readonly<WithoutTimestamps<PNetlifyUser>> {
	return {
		user_id,
		own_id: netlify_id
	}
}

export async function cleanup() {
	//console.log('>>> user create test cleanup')
	// REM: this will cascade users--xxx deletion
	await delete_user_by_email(get_test_base_user_01().usual_email)
}

////////////////////////////////////

// https://github.com/Vincit/objection.js/issues/534#issuecomment-334258236
after(async () => {
	console.log('* All tests ended, terminating knex…')
	await get_db().destroy()
})
