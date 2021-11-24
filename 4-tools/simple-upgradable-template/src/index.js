
const assert = require('tiny-invariant')
const memoize_one = require('memoize-one')

/////////////////////

const EOL = '\n'
const EXCERPT_LENGTH = 30

const KEYWORDS = {
	begin: 'BEGIN',
	end: 'END',
	build_tag: 'GENERATED-FROM-TEMPLATE',
	custom_slot: 'CUSTOM',
}

const SLOT_TYPES = {
	'js--short': {
		template_begin: '// OT⋄',
		template_end: '',
	},
	'js--long': {
		template_begin: '/* OT⋄',
		template_end: '*/',
	},
	'html': {
		template_begin: '<!-- OT⋄',
		template_end: '-->',
	}
}

/////////////////////

const find_next_element = memoize_one(function find_next_element(content, from_index, options = {}) {
	const { debug = false } = options

	if (debug) console.group('find_next_element', { from_index, options })

	const res = {
		index_begin: undefined, // first char = 1st char of the opening content = 1st char of a content start
		index_end: undefined, // last char = last char of the closing line
		whitespace: '',
		type: undefined,
		tag: undefined,
		id: undefined,
		version: undefined,
		content: undefined,
	}

	Object.keys(SLOT_TYPES).forEach(type => {
		const { template_begin, template_end } = SLOT_TYPES[type]

		const index_template_opening_begin = content.indexOf(template_begin, from_index)
		if (index_template_opening_begin < 0 || (res.index_begin >= 0 && index_template_opening_begin > res.index_begin))
			return

		res.index_begin = index_template_opening_begin
		res.type = type

		let index_template_opening_end = template_end
			? (content.indexOf(template_end, index_template_opening_begin) + template_end.length - 1)
			: (Math.max(content.indexOf(EOL, index_template_opening_begin) - EOL.length, 0) || content.length - 1)

		const key_and_id = content.slice(index_template_opening_begin + template_begin.length, index_template_opening_end - template_end.length + 1).trim()
		let split_key_and_id = key_and_id.split(' ').filter(e => !!e.trim())
		res.tag = split_key_and_id.shift()
		res.version = (res.tag === KEYWORDS.build_tag && split_key_and_id.slice(-1)[0].startsWith('v'))
			? split_key_and_id.pop()
			: null

		let index_template_closing_begin = undefined
		let index_template_closing_end = undefined
		assert(split_key_and_id[0] !== KEYWORDS.end, `unmatched end "${content.slice(index_template_opening_begin, index_template_opening_end + 1)}"`)
		if (split_key_and_id[0] === KEYWORDS.begin) {
			split_key_and_id.shift()

			const template_closing_begin = template_begin + res.tag + ' ' + KEYWORDS.end
			index_template_closing_begin = content.indexOf(
				template_closing_begin,
				index_template_opening_end
			)
			assert(index_template_closing_begin >= 0, `template must be matched, cant find "${template_closing_begin}"!`)
			//if (debug) console.log('found closing line:', content.slice(index_template_closing_begin, index_template_closing_begin + 30))
			index_template_closing_end = template_end
				? (content.indexOf(template_end, index_template_closing_begin) + template_end.length - 1)
				: (Math.max(content.indexOf(EOL, index_template_closing_begin) - EOL.length, 0) || content.length - 1)

			res.content = content.slice(index_template_opening_end + 1, index_template_closing_begin)
		}
		else {
			res.content = null
			index_template_closing_end = index_template_opening_end

			const prev_eol_index = content.lastIndexOf(EOL, index_template_opening_begin)
			/*res.index_begin = prev_eol_index < 0
				? 0
				: prev_eol_index + EOL.length*/
			res.whitespace = content.slice(prev_eol_index + EOL.length, index_template_opening_begin)
			if (res.whitespace.trim().length !== 0)
				res.whitespace = '' // some non ws are on the line
		}
		res.id = split_key_and_id.join(' ')

		/*const next_eol_index = content.indexOf(EOL, index_template_closing_end)
		res.index_end = next_eol_index < 0
			? content.length - 1
			: next_eol_index - EOL.length*/
		res.index_end = index_template_closing_end
		if (debug) console.log({
			index_template_opening_begin,
			fyi_after_opening_begin: content.slice(index_template_opening_begin, index_template_opening_begin + EXCERPT_LENGTH),
			index_template_opening_end,
			fyi_after_opening_end: content.slice(index_template_opening_end + 1, index_template_opening_end + EXCERPT_LENGTH + 1),
			index_template_closing_begin,
			fyi_after_closing_begin: content.slice(index_template_closing_begin, index_template_closing_begin + EXCERPT_LENGTH),
			index_template_closing_end,
			fyi_after_closing_end: content.slice(index_template_closing_end + 1, index_template_closing_end + EXCERPT_LENGTH + 1),
			fragment: content.slice(res.index_begin, res.index_end + 1),
			key_and_id,
			split_key_and_id,
			//prev_eol_index,
			//next_eol_index,
			res,
		})
	})

	if (debug) console.groupEnd()

	return res
})

// always regen a fully expanded one
function regen_element(extracted) {
	const { type, tag } = extracted
	const { template_begin, template_end } = SLOT_TYPES[type]
	let res = ''
		+ template_begin
		+ extracted.tag
		+ ' '

	if (tag === KEYWORDS.build_tag) {
		res += extracted.id
			+ (extracted.version ? ' ' + extracted.version : '')
	}
	else {
		res += KEYWORDS.begin + ' ' + extracted.id
		if (template_end)
			res += ' ' + template_end

		if (!extracted.content) {
			res += EOL // only place where we insert EOL. cleaner
			if (extracted.whitespace) res += extracted.whitespace // for equal indentation
		}
		else {
			res += extracted.content
		}

		res += ''
			+ template_begin
			+ extracted.tag
			+ ' '
			+ KEYWORDS.end
			+ ' '
			+ extracted.id
	}

	if (template_end)
		res += ' ' + template_end

	return res
}

/////////////////////

function apply({
	template,
	existing_target,
	debug = false,
}) {
	const find_next_options = { debug }
	if (debug) console.group('Applying Offirmo template…')
	if (debug) console.log('------------')

	assert(template, 'template should not be empty! (or what the need?)')

	if (debug) console.log('* Parsing template…')
	let template_parts = []
	let cursor = 0
	while (find_next_element(template, cursor, find_next_options).type) {
		const res = find_next_element(template, cursor, find_next_options)
		if (debug) console.log('  original:', '"' + template.slice(res.index_begin, res.index_end + 1) + '"')
		if (debug) console.log('  regenerated:', '"' + regen_element(res) + '"')

		template_parts.push(template.slice(cursor, res.index_begin))
		template_parts.push(res)
		cursor = res.index_end + 1
	}
	template_parts.push(template.slice(cursor, template.length))
	template_parts = template_parts.filter(p => !!p)
	if (debug) console.log('  TEMPLATE PARTS', template_parts)

	if (debug) console.log('* Parsing existing target file… (if any)')
	const existing_custom_by_id = {}
	if (existing_target) {
		let cursor = 0
		while (find_next_element(existing_target, cursor, find_next_options).type) {
			const res = find_next_element(existing_target, cursor, find_next_options)
			if (debug) console.log('  original:', '"' + template.slice(res.index_begin, res.index_end + 1) + '"')
			if (debug) console.log('  regenerated:', '"' + regen_element(res) + '"')
			const { tag, id, index_end } = res
			assert(!existing_custom_by_id[id], `only 0 or 1 custom part with id "${id}"!`)
			if (tag !== KEYWORDS.build_tag)
				existing_custom_by_id[id] = res
			cursor = index_end + 1
		}
	}
	if (debug) console.log('  FOUND EXISTING SLOT IDs', existing_custom_by_id)
	const unused_slot_ids = new Set(Object.keys(existing_custom_by_id))

	if (debug) console.log('* (re)generating target file…')
	const final = []
	template_parts.forEach(part => {
		if (typeof part === 'string') {
			final.push(part)
			return
		}

		const { id } = part
		final.push(regen_element(
			existing_custom_by_id[id]
				? existing_custom_by_id[id]
				: part
		))
		unused_slot_ids.delete(id)
	})

	if (unused_slot_ids.size > 0) {
		throw new Error(`Template slot(s) "${Array.from(unused_slot_ids.keys()).join(',')}" are not in the template and would be lost. Please update/remove them manually first!`)
	}
	if (debug) console.groupEnd()

	return final.join('')
}

module.exports = {
	apply,
}
