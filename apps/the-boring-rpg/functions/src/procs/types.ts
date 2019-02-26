import { Enum } from 'typescript-string-enums'

import { TimestampUTCMs } from '@offirmo/timestamps'

/////////////////////

const Method = Enum(
	// utils
	'echo',

	// tbrpg actions
	'play',

	// tbrpg meta
	'sync',
)
type Method = Enum<typeof Method> // eslint-disable-line no-redeclare

/////////////////////

interface TBRPGCall {

}

/////////////////////

export {
	Method,
	TBRPGCall,
}
