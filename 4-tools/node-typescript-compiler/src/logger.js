// TODO use a proper logger

const { LIB } = require('./consts')
const { version } = require('../package.json')


let banner = `[${LIB}] v${version}:`
function set_banner(_banner = banner) {
	banner = _banner
}

let seen_any_output_yet = false
function display_banner_if_1st_output() {
	if (seen_any_output_yet) return

	console.log(banner)

	seen_any_output_yet = true
}


module.exports = {
	set_banner,
	display_banner_if_1st_output,
}
