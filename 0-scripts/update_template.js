console.log('🧙️  Hello from update_template.js!')

const path = require('path')
const meow = require('meow')
const fs = require('fs-extra')
const assert = require('tiny-invariant').default
const memoize_one = require('memoize-one')

const { get_human_readable_UTC_timestamp_minutes } = require('../1-stdlib/timestamps')

/////////////////////

const cli = meow('create/update a target file from a template, with customizable parts',
	{
		flags: {
			template: {
				type: 'string',
			},
			final: {
				type: 'string',
			},
		},
	}
)

const SEP = '\n'

const KEYWORDS = {
	begin: 'BEGINS',
	end: 'ENDS',
	build_tag: 'TAG',
	custom_part: 'CUSTOM',
}

const ENTRIES = {
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
	console.log('find_next_element', { from_index })
	const res = {
		index_begin: undefined,
		index_end: undefined,
		whitespace: undefined,
		type: undefined,
		tag: undefined,
		id: undefined,
		v: undefined,
		content: undefined,
	}

	Object.keys(ENTRIES).forEach(key => {
		const { template_begin, template_end } = ENTRIES[key]
		/*console.log({
			key,
			template_begin,
			template_end,
		})*/
		const index_begin = template.indexOf(template_begin, from_index)
		if (index_begin < 0 || (res.index >= 0 && index_begin > res.index))
			return

		res.type = key
		const index_end = template.indexOf(template_end, index_begin)
		const key_and_id = template.slice(index_begin + template_begin.length, index_end).trim()
		let split_key_and_id = key_and_id.split(' ').filter(e => !!e.trim())
		res.tag = split_key_and_id.shift()
		res.id = split_key_and_id.join(' ')
		res.v = (res.tag === KEYWORDS.build_tag)
			? split_key_and_id.slice(-1)[0]
			: null

		const prev_sep_index = Math.max(template.lastIndexOf(SEP, index_begin), 0)
		res.whitespace = template.slice(prev_sep_index + 1, index_begin)
		res.index_begin = prev_sep_index
		const next_sep_index = Math.max(template.indexOf(SEP, index_end), 0) || template.length
		res.index_end = next_sep_index + 1
		console.log({
			index_begin,
			after_begin: template.slice(index_begin, index_begin + 20),
			index_end,
			after_end: template.slice(index_end, index_end + 20),
			line: '"' + template.slice(prev_sep_index, next_sep_index) + '"',
			key_and_id,
			split_key_and_id,
			prev_sep_index,
			next_sep_index,
		})
	})

	return res
})

function regen_element(extracted) {
	const { type } = extracted
	const { template_begin, template_end } = ENTRIES[type]
	let res = ''
		+ extracted.whitespace
		+ template_begin
		+ extracted.tag
		+ ' '
		+ extracted.id
		+ (extracted.version ? ' ' + extracted.version : '')

	if (extracted.content) {
		res += ' ' + KEYWORDS.begin
		if (template_end)
			res += ' ' + template_end

		res += extracted.content

		res = ''
			+ template_begin
			+ extracted.tag
			+ ' '
			+ extracted.id
			+ ' ' + KEYWORDS.end
	}

	if (template_end)
		res += ' ' + template_end

	return res
}

/////////////////////

console.log('🐈  meow', {
	cwd: process.cwd(),
	'cli.flags': cli.flags,
})

try {
	assert(cli.flags.template)
	assert(cli.flags.final)

	console.log('* Parsing template…')
	const template_path = path.resolve(process.cwd(), cli.flags.template)
	const final_path = path.resolve(process.cwd(), cli.flags.final)

	const template = fs.readFileSync(template_path, 'utf8');
	const template_parts = []
	let index = 0
	while (find_next_element(template, index).type) {
		const res = find_next_element(template, index)
		console.log('found:', res)
		console.log('original:', '"' + template.slice(res.index_begin, res.index_end) + '"')
		console.log('regenerated:', '"' + regen_element(res) + '"')
		template_parts.push(template.slice(index, res.index_begin))
		template_parts.push(res)
		index = res.index_end
	}
	template_parts.push(template.slice(index, template.length))
	console.log('TEMPLATE PARTS', template_parts)

	console.log('* Parsing existing target file… (if any)')
	const existing_custom_by_id = {}
	try {
		const existing = fs.readFileSync(final_path, 'utf8');
		const existing_parts = []
		let index = 0
		while (find_next_element(existing, index).type) {
			const res = find_next_element(existing, index)
			console.log(res, regen_element(res))
			const { id } = res
			assert(!existing_parts_by_id[id])
			existing_custom_by_id[id] = res
			existing_parts.push(existing.slice(index, res.index_begin))
			existing_parts.push(res)
			index = res.index_end
		}
		console.log('EXISTING PARTS', existing_parts)
	}
	catch (err) {
		if (!err.message.startsWith('ENOENT')) {
			throw err
		}
	}

	console.log('* Creating/updating target file…')
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

	console.log('----\n' + final.join(SEP))
}
catch (err) {
	console.error(err)
	cli.showHelp()
}
