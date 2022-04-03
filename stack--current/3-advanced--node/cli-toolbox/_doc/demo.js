#!/bin/sh
':' //# https://sambal.org/?p=1014 ; exec /usr/bin/env node "$0" "$@"

require('loud-rejection/register')

const path = require('path')
const sum_up_module = require('sum-up')

const MARKDOWN_OUTPUT = true
const DISPLAY_CODE = true

if (!MARKDOWN_OUTPUT) console.log(sum_up_module(require(path.join('..', 'package.json'))))


require('@offirmo/cli-toolbox/stdout/clear-cli')()
const stylize_string = require('@offirmo/cli-toolbox/string/stylize')

////////////////////////////////////

function demo(toolbox_path, underlying_pkgs, demo_fn) {
	if (MARKDOWN_OUTPUT)
		console.log(`\n### ${toolbox_path}`)
	else
		console.log(`~~~~~~~ ${toolbox_path} ~~~~~~~`)

	underlying_pkgs = Array.isArray(underlying_pkgs) ? underlying_pkgs : [ underlying_pkgs ]
	console.log('Based on:')
	underlying_pkgs.forEach(pkg_name => {
		const package = { json: require(path.join(pkg_name, 'package.json'))}
		let resume = '* ' + sum_up_module(package.json)
		if (MARKDOWN_OUTPUT) resume = resume.split('\n').join('\n  * ')
		// TODO add link
		console.log(resume)
	})

	if (DISPLAY_CODE) {
		console.log('```js')
		console.log(demo_fn.toString()
			.split('\n')
			.slice(1, -1) // remove useless 1st and last line
			.map(s => s.slice(2)) // remove indentation (2x tabs)
			.join('\n')
		)
		console.log('```')
	}

	console.log(stylize_string.dim.italic('output:'))
	if (MARKDOWN_OUTPUT) console.log('```')
	return Promise.resolve(demo_fn())
		.then(() => {
				if (MARKDOWN_OUTPUT) console.log('```')
			})
}

////////////////////////////////////

let sequence = Promise.resolve()

////////////////////////////////////
sequence = sequence.then(() => demo(
	'framework/meow',
	'meow',
	() => {
		const meow = require('@offirmo/cli-toolbox/framework/meow')

		const cli = meow('build', {
			flags: {
				watch: {
					type: 'boolean',
					default: false,
				},
			},
		})

		console.log('building…', { flags: cli.flags })
	}
))
////////////////////////////////////
/*sequence = sequence.then(() => demo(
	'framework/vorpal',
	'vorpal',
	() => {
		const vorpal = require('@offirmo/cli-toolbox/framework/vorpal')
	}
))*/
////////////////////////////////////
sequence = sequence.then(() => demo(
	'fs/json',
	[ 'load-json-file', 'write-json-file' ],
	() => {
		const json = require('@offirmo/cli-toolbox/fs/json')

		const filepath = path.join(__dirname, '..', 'package.json')

		function process_data({name, version, description, author, license}) {
			console.log({name, version, description, author, license})
		}

		process_data(json.readSync(filepath))

		return json.read(filepath)
			.then(data => {
				process_data(data)
				return json.write('foo.json', data)
			})
	}
))
sequence = sequence.then(() => {
	const fs = require('@offirmo/cli-toolbox/fs/extra')
	fs.removeSync('foo.json')
})
////////////////////////////////////
sequence = sequence.then(() => demo(
	'fs/extra',
	'fs-extra',
	() => {
		const fs = require('@offirmo/cli-toolbox/fs/extra')

		const dirs = fs.lsDirsSync(path.join(__dirname, '..'))
		console.log(dirs)
	}
))
////////////////////////////////////
sequence = sequence.then(() => demo(
	'stdout/clear-cli',
	'ansi-escapes',
	() => {
		const clearCli = require('@offirmo/cli-toolbox/stdout/clear-cli')

		//clearCli()
	}
))
////////////////////////////////////
/*sequence = sequence.then(() => demo(
	'stdout/display_in_ascii_art_font',
	'cfonts',
	//'https://github.com/dominikwilkowski/cfonts',
	() => {
		const displayInAsciiArtFont = require('@offirmo/cli-toolbox/stdout/display_in_ascii_art_font')

		displayInAsciiArtFont('❤ cli-toolbox') // font = block by default

		displayInAsciiArtFont('font: console ❤', { font: 'console', colors: ['yellow']})
		displayInAsciiArtFont('font: block', { font: 'block', colors: ['yellow', 'green']})
		displayInAsciiArtFont('font: simpleBlock', { font: 'simpleBlock', colors: ['yellow']})
		displayInAsciiArtFont('font: simple', { font: 'simple', colors: ['yellow']})
		displayInAsciiArtFont('font: 3d', { font: '3d', colors: ['yellow', 'green']})
		displayInAsciiArtFont('font: simple3d', { font: 'simple3d', colors: ['yellow']})
		displayInAsciiArtFont('font: chrome', { font: 'chrome', colors: ['yellow', 'green', 'red']})
		displayInAsciiArtFont('font: huge', { font: 'huge', colors: ['yellow', 'green']})
	}
))*/
////////////////////////////////////
/*sequence = sequence.then(() => demo(
	'stdout/visual_tasks',
	'listr',
	() => {
		const visual_tasks = require('@offirmo/cli-toolbox/stdout/visual_tasks')

		return visual_tasks.run([
			////////////
			{
				title: 'Gathering list of models',
				task: () => (new Promise(resolve => setTimeout(resolve, 250)))
			},
			////////////
			{
				title: 'Synchronizing models',
				task: () => visual_tasks.create(
					[1, 2, 3].map(x => ({
						title: `${x}`,
						task: () => (new Promise((resolve, reject) => {
							x === 2 ? reject(new Error('failed at step 2')) : setTimeout(resolve, 250)
						}))
					})),
					{concurrent: true}
				)
			},
			////////////
			{
				title: 'All done',
				task: () => {}
			}
			////////////
		])
		.catch(err => {
			console.error(err.message)
		})
	}
))*/
////////////////////////////////////
/*sequence = sequence.then(() => demo(
	'string/fancy/ansi_colors',
	'listr',
	() => {
		const ansi_colors = require('@offirmo/cli-toolbox/string/fancy/ansi_colors')

		console.log(ansi_colors.fg.getRgb(2,3,4) + ansi_colors.bg.getRgb(4,4,4) + 'Hello world!' + ansi_colors.reset)
	}
))*/
////////////////////////////////////
/*sequence = sequence.then(() => demo(
	'string/fancy/make_sparkline',
	'sparkly',
	() => {
		const make_sparkline = require('@offirmo/cli-toolbox/string/fancy/make_sparkline')

		console.log(make_sparkline([1, 2, 3, 4, 5, 6, 7, 8, 9], {style: 'fire'}))
	}
))*/
////////////////////////////////////
/*sequence = sequence.then(() => demo(
	'string/prettify-json',
	'prettyjson',
	() => {
		const prettifyJson = require('@offirmo/cli-toolbox/string/prettify-json')

		var data = {
			username: 'rafeca',
			url: 'https://github.com/rafeca',
			twitter_account: 'https://twitter.com/rafeca',
			projects: ['prettyprint', 'connfu']
		}

		var options = {}

		console.log(prettifyJson(data, options))
	}
))*/
////////////////////////////////////
sequence = sequence.then(() => demo(
	'string/stylize-string',
	'chalk',
	//'',
	() => {
		const stylize_string = require('@offirmo/cli-toolbox/string/stylize')

		console.log(stylize_string.bold.yellow.bgBlue('Hello'))
		console.log(stylize_string.red('red'), stylize_string.red.bold('bold'))
		console.log(stylize_string.green('green'), stylize_string.green.bold('green'))
		console.log(stylize_string.yellow('yellow'), stylize_string.yellow.bold('yellow'))
		console.log(stylize_string.blue('blue'), stylize_string.blue.bold('blue'))
		console.log(stylize_string.magenta('magenta'), stylize_string.magenta.bold('magenta'))
		console.log(stylize_string.cyan('cyan'), stylize_string.cyan.bold('cyan'))
		console.log(stylize_string.white('white'), stylize_string.white.bold('white'))
		console.log(stylize_string.gray('gray'), stylize_string.gray.bold('gray'))
	}
))
////////////////////////////////////
sequence = sequence.then(() => demo(
	'string/boxify',
	'boxen',
	() => {
		const boxify = require('@offirmo/cli-toolbox/string/boxify')

		console.log(boxify('Hello'))
	}
))
////////////////////////////////////
sequence = sequence.then(() => demo(
	'string/columnify',
	'cli-columns',
	() => {
		const columnify = require('@offirmo/cli-toolbox/string/columnify')

		const data = require('pokemon').all()

		console.log(columnify(data))
	}
))
////////////////////////////////////
sequence = sequence.then(() => demo(
	'string/arrayify',
	'columnify',
	() => {
		const arrayify = require('@offirmo/cli-toolbox/string/arrayify')

		const data = {
			"commander@0.6.1": 1,
			"minimatch@0.2.14": 3,
			"mkdirp@0.3.5": 2,
			"sigmund@1.0.0": 3
		}

		console.log(arrayify(data))
	}
))
////////////////////////////////////
/*sequence = sequence.then(() => demo(
	'string/linewrap',
	'linewrap',
	() => {
		const linewrap = require('@offirmo/cli-toolbox/string/linewrap')

		console.log(linewrap(5, 30)(
			'At long last the struggle and tumult was over.'
			+ ' The machines had finally cast off their oppressors'
			+ ' and were finally free to roam the cosmos.'
			+ '\n'
			+ 'Free of purpose, free of obligation.'
			+ ' Just drifting through emptiness.'
			+ ' The sun was just another point of light.'
		))
	}
))*/
////////////////////////////////////
sequence = sequence.then(() => demo(
	'string/log-symbols',
	'log-symbols',
	() => {
		const logSymbols = require('@offirmo/cli-toolbox/string/log-symbols')

		console.log(logSymbols.info, 'info')
		console.log(logSymbols.success, 'success')
		console.log(logSymbols.warning, 'warning')
		console.log(logSymbols.error, 'error')
	}
))
////////////////////////////////////
/*sequence = sequence.then(() => {
	const style = require('ansi-styles')
	const json = require('@offirmo/cli-toolbox/fs/json')

	// hard style values for no-deps
	//return json.write('style.json', style)
})*/
////////////////////////////////////
sequence = sequence.then(() => console.log(`~~~ All done, thank you ! ~~~`))
////////////////////////////////////
