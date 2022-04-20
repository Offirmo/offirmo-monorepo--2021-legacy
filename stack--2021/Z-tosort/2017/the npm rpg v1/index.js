const loadJsonFile = require('load-json-file')
const { prettifyJson, stylizeString } = require('./deps')
const { render_non_interactive_before, render_non_interactive_after } = require('./screens')
const { init_globalize, init_savegame } = require('./init')
const { play } = require('./actions')
const { render_cta } = require('./calls-to-action')
const { start_loop } = require('./interactive_mode')

/////////////////////////////////////////////////

const MINIMAL_TERMINAL_WIDTH = 80

const PACKAGE_JSON_PATH = require('path').join('.', 'package.json')
const { version } = loadJsonFile.sync(PACKAGE_JSON_PATH)

const options = {
	version,
	verbose: false, // XXX
	is_interactive: true,
	may_clear_screen: true,
	term_width: MINIMAL_TERMINAL_WIDTH,
}


options.is_interactive = !!process.stdout.isTTY // TODO read params also
//options.is_interactive = false
options.may_clear_screen = options.is_interactive
options.globalize = init_globalize(options)
options.config = init_savegame(options)
options.rendering_options = {
	mode: 'ansi',
	globalize: options.globalize,
	stylize: stylize_tbrpg_string,
	last_adventure: options.config.store.last_adventure,
}

/////////////////////////////////////////////////

function stylize_tbrpg_string(style, s) {
	switch(style) {
		case 'important_part':
			return stylizeString.bold(s)
		case 'elite_mark':
			return stylizeString.yellow.bold(s)
		case 'item_quality_common':
			return stylizeString.gray(s)
		case 'item_quality_uncommon':
			return stylizeString.green(s)
		case 'item_quality_rare':
			return stylizeString.blue(s)
		case 'item_quality_epic':
			return stylizeString.magenta(s)
		case 'item_quality_legendary':
			return stylizeString.red(s)
		case 'item_quality_artifact':
			return stylizeString.yellow(s)
		case 'change_outline':
			return stylizeString.italic.bold.red(s)
		default:
			return `[XXX unkwown style ${style}]`+ stylizeString.bold.red(s)
	}
}

/////////////////////////////////////////////////

if (options.is_interactive) {
	start_loop(options)
		.catch(e => console.error('Error:\n' + stylizeString.red(prettifyJson(e))))
		// TODO report
		.then(() => console.log('Quitting...'))
}

/////////////////////////////////////////////////

if (!options.is_interactive) {
	render_non_interactive_before(options)
	play(options)
	render_non_interactive_after(options)
	render_cta(options)
}

console.log('\n---------------------------------------------------------------\n')
