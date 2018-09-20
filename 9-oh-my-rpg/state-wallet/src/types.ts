import { Enum } from 'typescript-string-enums'

/////////////////////

const Currency = Enum(
	'coin',
	'token',
)
type Currency = Enum<typeof Currency> // eslint-disable-line no-redeclare

/////////////////////

interface State {
	schema_version: number
	revision: number

	coin_count: number
	token_count: number
}

/////////////////////

export {
	Currency,
	State,
}

/////////////////////
