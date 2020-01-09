import { HumanReadableTimestampUTCMs } from '@offirmo-private/timestamps'


export interface ParseResult {
	original_name: string

	extension_lc: string
	date: undefined | null | HumanReadableTimestampUTCMs
	is_date_ambiguous: undefined | boolean
	meaningful_part: string
}

type State = 'starting' | 'in_parenthesis'
const SEPARATORS = '-_+:; \t.'

export function parse(name: string): ParseResult {
	const result = {
		original_name: name,
		extension_lc: '',
		has_date: undefined,
		date: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: '',
	}

	const name_lc = name.toLowerCase()
	let state: State = 'starting'
	let index = 0
	let prefix = ''
	let suffix: ''

	let buffer = name
	console.log({ buffer })
	result.extension_lc = name_lc.split('.').slice(-1)[0] || ''
	console.log({ extension_lc: result.extension_lc })
	buffer = name.slice(0, -result.extension_lc.length)
	console.log({ buffer })
	buffer = buffer.trim()
	console.log({ buffer })

	return result
}
