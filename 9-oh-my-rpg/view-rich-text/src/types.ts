/////////////////////

import { Enum } from 'typescript-string-enums'

/////////////////////

const TextClass = Enum(
	'person',
	'item',
	'place',
)
type TextClass = Enum<typeof TextClass> // eslint-disable-line no-redeclare

/////////////////////

interface RenderItemOptions {
	reference_power?: number
	display_quality?: boolean
	display_values?: boolean
	display_power?: boolean
	display_sell_value?: boolean
}

/////////////////////

export {
	TextClass,
	RenderItemOptions,
}

/////////////////////
