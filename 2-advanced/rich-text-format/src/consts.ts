const LIB = '@offirmo/rich-text-format'

const SCHEMA_VERSION: number = 1

const NODE_TYPE_TO_DISPLAY_MODE: { [k: string]: 'inline' | 'block' } = {
	// classics inline
	'span': 'inline',
	'strong': 'inline',
	'weak': 'inline',
	'em': 'inline',
	// classics block
	'heading': 'block',
	'hr': 'block',
	'ol': 'block',
	'ul': 'block',
	// special
	'br': 'inline',
	'inline_fragment': 'inline',
	'block_fragment': 'block',
	// internally used, don't mind
	'li': 'block',
}

export {
	LIB,
	SCHEMA_VERSION,
	NODE_TYPE_TO_DISPLAY_MODE,
}
