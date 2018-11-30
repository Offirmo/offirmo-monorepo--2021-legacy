import prettyjson from 'prettyjson'

import indent_string from './indent-string'


// https://github.com/rafeca/prettyjson
type PrettyJsonOptions = any

function prettify_json(data: any, options: PrettyJsonOptions = {}) {
	if (!data) return String(data)

	let { outline, ...prettyjson_options } = options

	prettyjson_options = {
		//keysColor: 'dim',
		...prettyjson_options
	}

	const result = prettyjson.render(data, prettyjson_options)

	if (outline) {
		return '\n{{{{{{{'
			+ indent_string(
				'\n' + result,
				1,
				{indent: '	'}
			)
			+ '\n}}}}}}}'
	}

	return result
}

function dump_pretty_json(msg: string, data: Readonly<any>, options?: Readonly<PrettyJsonOptions>) {
	console.log(msg)
	console.log(prettify_json(data, options))
}

export default prettify_json

export {
	prettify_json,
	dump_pretty_json,
}
