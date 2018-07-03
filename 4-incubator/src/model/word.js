
const WORD_TYPES = [
	'noun',
	'verb',
	'adjective',
	'other',
]

export function create({
	content,
	type,
							  }) {

	content = content.trim()
	type = type.trim()

	return {
		content,
		type
	}
}
