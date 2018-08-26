/////////////////////

import { Enum } from 'typescript-string-enums'

/////////////////////

const TextClass = Enum(
	'person',
	'item',
	'place',
)
type TextClass = Enum<typeof TextClass>

/////////////////////

interface RenderItemOptions {
	display_quality?: boolean
	display_values?: boolean
}

/////////////////////

export {
	TextClass,
	RenderItemOptions,
}

/////////////////////
