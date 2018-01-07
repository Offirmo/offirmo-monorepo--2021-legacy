"use strict";

const {
	prettify_json,
	indent_string,
} = require('../libs')


function prettify_json_for_debug() {
	return '\n{{{{{{{'
		+ indent_string(
			'\n' + prettify_json.apply(null, arguments),
			1,
			{indent: '	'}
		)
		+ '\n}}}}}}}'
}


module.exports = {
	prettify_json_for_debug,
}
