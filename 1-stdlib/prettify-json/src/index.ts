import prettyjson from 'prettyjson'

import indent_string from './indent-string'


// https://github.com/rafeca/prettyjson
interface PrettyJsonOptions {
	outline?: boolean
	[k: string]: any
}

interface PrettifyJsonOptions extends PrettyJsonOptions {
	outline?: boolean
}

function prettify_json(data: Readonly<any>, options: Readonly<PrettifyJsonOptions> = {}) {
	if (!data) return String(data)

	let { outline, indent, ...prettyjson_options } = options

	prettyjson_options = {
		//keysColor: 'dim',
		...prettyjson_options,
	}

	let result = prettyjson.render(data, prettyjson_options)

	if (outline) {
		result = '\n{{{{{{{'
			+ indent_string(
				'\n' + result,
				1,
				{indent: '	'},
			)
			+ '\n}}}}}}}'
	}

	if (indent) {
		result = indent_string(
			result,
			indent,
		)
	}

	return result
}

function dump_pretty_json(msg: string, data: Readonly<any>, options?: Readonly<PrettifyJsonOptions>) {
	console.log(msg)
	console.log(prettify_json(data, options))
}

export default prettify_json

export {
	prettify_json,
	dump_pretty_json,
}
