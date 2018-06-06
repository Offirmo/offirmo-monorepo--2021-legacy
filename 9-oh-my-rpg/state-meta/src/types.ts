import { Enum } from 'typescript-string-enums'

/////////////////////

interface State {
	schema_version: number
	revision: number

	uuid: string
	name: string
	email: string | null
	allow_telemetry: boolean
	//creation_date: XXX TODO
}

/////////////////////

export {
	State,
}

/////////////////////
