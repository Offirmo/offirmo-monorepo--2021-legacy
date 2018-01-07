"use strict";

/////////////////////////////////////////////////
// node <8 zone
var loadJsonFile = require('load-json-file')
var PACKAGE_JSON_PATH = require('path').join('.', 'package.json')
var package_json = loadJsonFile.sync(PACKAGE_JSON_PATH)
var semver = require('semver')
if (!semver.satisfies(process.version, package_json.engines.node)) {
	console.error('ERROR: Invalid node, must be: ' + package_json.engines.node + '!\n')
	process.exit(3)
}

/////////////////////////////////////////////////

const { stylize_string } = require('./libs')
const { prettify_json_for_debug } = require('./utils/debug')

const { SEC, init_savegame } = require('./init')
const { play } = require('./actions')
const { start_loop } = require('./interactive_mode')

/////////////////////////////////////////////////

SEC.xPromiseTryCatch('starting', async ({ SEC, logger }) => {
	const MINIMAL_TERMINAL_WIDTH = 80

	const verbose = false // XXX
	if (verbose) {
		logger.setLevel('verbose')
		logger.verbose('verbose mode activated')
	}

	const { version } = package_json
	const options = {
		version,
		verbose,
		is_interactive: true,
		may_clear_screen: true,
		term_width: MINIMAL_TERMINAL_WIDTH,
	}
	options.is_interactive = !!process.stdout.isTTY // TODO read params also
	//options.is_interactive = false
	options.may_clear_screen = options.is_interactive
	options.config = init_savegame(options)

	/////////////////////////////////////////////////

	if (options.is_interactive) {
		return start_loop(SEC, options)
			.then(() => console.log('Quitting...'))
	}

	/////////////////////////////////////////////////

	if (!options.is_interactive) {
		throw new Error('Non-interactive mode or non-tty terminals are not supported at this time, sorry!')
		//play(options)
		//render_cta(options)
	}

//console.log('\n---------------------------------------------------------------\n')

})
