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

export {
	TextClass,
}

/////////////////////
