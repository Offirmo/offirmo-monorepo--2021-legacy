import { Enum } from 'typescript-string-enums'

import { ActionType } from './types'

/////////////////////

// needed for some validations
function get_action_types(): string[] {
	return Enum.keys(ActionType)
}

/////////////////////

export {
	get_action_types,
}
export * from './types'
