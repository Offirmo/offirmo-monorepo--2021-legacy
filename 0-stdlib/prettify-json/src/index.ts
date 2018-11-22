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

function dump_pretty_json(name: string, data: any, options?: PrettyJsonOptions) {

}

export default prettify_json
