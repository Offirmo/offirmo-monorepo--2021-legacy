import { Enum } from 'typescript-string-enums'

import { BaseUState } from '@offirmo-private/state-utils'

/////////////////////

const Currency = Enum(
	'coin',
	'token',
)
type Currency = Enum<typeof Currency> // eslint-disable-line no-redeclare

/////////////////////

interface State extends BaseUState {
	coin_count: number
	token_count: number
}

/////////////////////

export {
	Currency,
	State,
}

/////////////////////
