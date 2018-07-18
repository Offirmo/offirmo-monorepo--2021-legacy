const LIB = '@offirmo/rich-text-format'

const SCHEMA_VERSION: number = 1

const NODE_TYPE_TO_DISPLAY_MODE: { [k: string]: 'inline' | 'block' } = {
	'span': 'inline',
	'strong': 'inline',
	'em': 'inline',

	// display "block"
	'heading': 'block',
	'hr': 'block',
	'ol': 'block',
	'ul': 'block',

	// internally used, don't mind
	'li': 'block',

	// special
	'br': 'inline',
	'fragment': 'inline',
}

export {
	LIB,
	SCHEMA_VERSION,
	NODE_TYPE_TO_DISPLAY_MODE,
}
