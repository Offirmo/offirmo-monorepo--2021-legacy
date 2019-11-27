import { BaseUser, NetlifyUser } from "./types"
import { delete_user_by_email } from "./delete"
import {WithoutTimestamps} from "../types";
import get_db from "../db";


export const TEST_NETLIFY_ID: NetlifyUser['own_id'] = 'netlify-#foo'

export function get_test_base_user(p: Partial<BaseUser> = {}): Readonly<BaseUser> {
	return {
		called: 'The Tester',
		email: 'test@test.io',
		avatar_url: 'https://some.gravatar/test',
		roles: [ 'test' ],
		...p,
	}
}

export function get_test_base_netlify_user(user_id: number, netlify_id: string = TEST_NETLIFY_ID): Readonly<WithoutTimestamps<NetlifyUser>> {
	return {
		user_id,
		own_id: TEST_NETLIFY_ID
	}
}

export async function cleanup() {
	//console.log('>>> user create test cleanup')
	// REM: this will cascade users--xxx deletion
	await delete_user_by_email(get_test_base_user().email)
}


after(async () => {
	console.log('* All tests ended, terminating knex…')
	await get_db().destroy()
})
