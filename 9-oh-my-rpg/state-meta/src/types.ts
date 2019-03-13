import { Enum } from 'typescript-string-enums'

/////////////////////

interface State {
	schema_version: number
	revision: number

	persistence_id: string | null | undefined

	is_web_diversity_supporter: boolean

	is_logged_in: boolean
	roles: string[]
}

/////////////////////

export {
	State,
}

/////////////////////
