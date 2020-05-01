
const assert = require('tiny-invariant').default
const memoize_one = require('memoize-one')

/////////////////////

const EOL = '\n'

const KEYWORDS = {
	begin: 'BEGIN',
	end: 'END',
	build_tag: 'GENERATED-FROM-TEMPLATE',
	custom_slot: 'CUSTOM',
}

const SLOT_TYPES = {
	'js': {
		template_begin: '// OT⋄',
		template_end: '',
	},
	'html': {
		template_begin: '<!-- OT⋄',
		template_end: '-->',
	}
}

/////////////////////

const find_next_element = memoize_one(function find_next_element(template, from_index) {
	console.group('find_next_element', { from_index })

	const res = {
		index_begin: undefined, // first char = whitespace or 1st char of a template start
		index_end: undefined, // last char = always EOL (by design) unless it's the end of file
		whitespace: undefined,
		type: undefined,
		tag: undefined,
		id: undefined,
		version: undefined,
		content: undefined,
	}

	Object.keys(SLOT_TYPES).forEach(type => {
		const { template_begin, template_end } = SLOT_TYPES[type]
		/*console.log({
			type,
			template_begin,
			template_end,
		})*/
		const index_template_begin = template.indexOf(template_begin, from_index)
		if (index_template_begin < 0 || (res.index >= 0 && index_template_begin > res.index))
			return

		// optional fields TODO no need!
		res.content = null

		res.type = type
		let index_template_end = template_end
			? template.indexOf(template_end, index_template_begin) + template_end.length
			: (Math.max(template.indexOf(EOL, index_template_begin), 0) || template.length)
		const key_and_id = template.slice(index_template_begin + template_begin.length, index_template_end).trim()
		let split_key_and_id = key_and_id.split(' ').filter(e => !!e.trim())
		res.tag = split_key_and_id.shift()
		res.version = (res.tag === KEYWORDS.build_tag && split_key_and_id.slice(-1)[0].startsWith('v'))
			? split_key_and_id.pop()
			: null
		res.id = split_key_and_id.join(' ')

		const prev_eol_index = Math.max(template.lastIndexOf(EOL, index_template_begin), 0)
		res.whitespace = template.slice(prev_eol_index + EOL.length, index_template_begin)
		res.index_begin = prev_eol_index + 1
		const next_eol_index = Math.max(template.indexOf(EOL, index_template_begin), 0) || template.length
		res.index_end = next_eol_index + 1
		console.log({
			index_begin: index_template_begin,
			fyi_after_begin: template.slice(index_template_begin, index_template_begin + 20),
			index_end: index_template_end,
			fyi_after_end: template.slice(index_template_end + 1, index_template_end + 20),
			line: template.slice(prev_eol_index, next_eol_index),
			key_and_id,
			split_key_and_id,
			prev_sep_index: prev_eol_index,
			next_sep_index: next_eol_index,
		})
	})

	console.groupEnd()

	return res
})

function regen_element(extracted) {
	const { type, tag } = extracted
	const { template_begin, template_end } = SLOT_TYPES[type]
	let res = ''
		+ extracted.whitespace
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

		res += EOL
		if (extracted.content) {
			res += extracted.content + EOL
		}

		res += extracted.whitespace
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

function without_last_eol_if_any(s) {
	return s.endsWith(EOL)
		? s.slice(0, -1)
		: s
}

/////////////////////

function apply({
	template,
	existing_target,
	debug = true,
}) {
	if (debug) console.group('Applying Offirmo template…')
	if (debug) console.log('------------')

	assert(template, 'template should not be empty! (or what the need?)')

	if (debug) console.log('* Parsing template…')
	let template_parts = []
	let index = 0
	while (find_next_element(template, index).type) {
		const res = find_next_element(template, index)
		if (debug) console.log('  found:', res)
		if (debug) console.log('  original:', '"' + template.slice(res.index_begin, res.index_end) + '"')
		if (debug) console.log('  regenerated:', '"' + regen_element(res) + '"')

		template_parts.push(without_last_eol_if_any(template.slice(index, res.index_begin - 1)))
		template_parts.push(res)
		index = res.index_end
	}
	template_parts.push(template.slice(index, template.length))
	template_parts = template_parts.filter(p => !!p)
	if (debug) console.log('  TEMPLATE PARTS', template_parts)

	if (debug) console.log('* Parsing existing target file… (if any)')
	const existing_custom_by_id = {}
	if (existing_target) {
		let index = 0
		while (find_next_element(existing_target, index).type) {
			const res = find_next_element(existing_target, index)
			if (debug) console.log(' ', res, regen_element(res))
			const { id } = res
			assert(!existing_custom_by_id[id], `only 0 or 1 custom part with id "${id}"!`)
			existing_custom_by_id[id] = res
			index = res.index_end
		}
	}
	if (debug) console.log('  FOUND EXISTING SLOT IDs', existing_custom_by_id)

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
	})

	if (debug) console.groupEnd()

	return final.join(EOL)
}

module.exports = {
	apply,
}

