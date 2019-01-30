import { Enum } from 'typescript-string-enums'

/////////////////////

interface State {
	schema_version: number
	revision: number

	is_web_diversity_supporter: boolean

	is_logged_in: boolean
	roles: string[]
	
	//allow_telemetry: boolean
}

/////////////////////

export {
	State,
}

/////////////////////
