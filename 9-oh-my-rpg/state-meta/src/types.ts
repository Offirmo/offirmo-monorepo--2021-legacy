import { Enum } from 'typescript-string-enums'

/////////////////////

// TODO needed?
interface State {
	schema_version: number
	revision: number

	uuid: string
	name: string // user name, not character name
	email: string | null
	allow_telemetry: boolean
	//creation_date: XXX TODO

	//has firefox
}

/////////////////////

export {
	State,
}

/////////////////////
