import { Enum } from 'typescript-string-enums'

import { BaseUState } from '@offirmo-private/state-utils'

/////////////////////

interface State extends BaseUState {
	slot_id: number

	is_web_diversity_supporter: boolean

	is_logged_in: boolean // useful for achievements
	roles: string[]
}

/////////////////////

export {
	State,
}

/////////////////////
