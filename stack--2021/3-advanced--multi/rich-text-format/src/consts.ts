const LIB = '@offirmo-private/rich-text-format'

const SCHEMA_VERSION: number = 1

const NODE_TYPE_TO_DISPLAY_MODE: Readonly<{ [k: string]: 'inline' | 'block' }> = {
	// classics inline
	'inline_fragment': 'inline',
	'strong': 'inline',
	'weak': 'inline',
	'em': 'inline',

	// classics block
	'block_fragment': 'block',
	'heading': 'block',
	'hr': 'block',
	'ol': 'block',
	'ul': 'block',

	// special
	'br': 'inline',

	// internally used, don't mind
	'li': 'block',
}

export {
	LIB,
	SCHEMA_VERSION,
	NODE_TYPE_TO_DISPLAY_MODE,
}
