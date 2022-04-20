#!/bin/sh
':' //# http://sambal.org/?p=1014 ; exec /usr/bin/env node "$0" "$@"

require('loud-rejection/register')

const path = require('path')
const sumUp = require('sum-up')

const MARKDOWN_OUTPUT = false
const DISPLAY_CODE = false
console.log(sumUp(require('../../package.json')));

const originalRequire = require
require = function(moduleRef) {
	if (moduleRef.startsWith('@offirmo/cli-toolbox/'))
		moduleRef = '../../' + moduleRef.slice(21)
	return originalRequire(moduleRef)
}

require('@offirmo/cli-toolbox/stdout/clear-cli')()
const stylizeString = require('@offirmo/cli-toolbox/string/stylize')
const _ = require('@offirmo/cli-toolbox/lodash')


function demo(moduleName, urlOrModeModuleNames, fn) {
	console.log(`${MARKDOWN_OUTPUT?'### ':''}~~~~~~~ ${moduleName} ~~~~~~~`)

	urlOrModeModuleNames = _.flatten([ urlOrModeModuleNames ])
	urlOrModeModuleNames.forEach(urlOrModeModuleName => {
		if (urlOrModeModuleName.slice(0, 4) === 'http') {
			console.log(`See more at ${stylizeString.blue(urlOrModeModuleName)}`)
		}
		else {
			const modulePackage = { json: require(path.join('../../node_modules', urlOrModeModuleName, 'package.json'))}
			let resume = 'Based on: ' + sumUp(modulePackage.json)
			if (MARKDOWN_OUTPUT) resume = resume.split('\n').join('\n\n')
			console.log(resume)
		}
	})

	if (DISPLAY_CODE) {
		if (MARKDOWN_OUTPUT) console.log('```js')
		console.log(fn.toString().split('\n').slice(1, -1).map(s => s.slice(2)).join('\n'))
		if (MARKDOWN_OUTPUT) console.log('```')
	}

	console.log(stylizeString.dim.italic('```'))
	return Promise.resolve(fn())
	.then(() => {
		console.log(stylizeString.dim.italic('```'))
	})
}

let sequence = Promise.resolve()


////////////////////////////////////
sequence = sequence.then(() => demo(
	'framework/meow',
	'meow',
	//'https://github.com/sindresorhus/meow',
	() => {
		const meow = require('@offirmo/cli-toolbox/framework/meow')
	}
))
////////////////////////////////////
sequence = sequence.then(() => demo(
	'framework/vorpal',
	'vorpal',
	() => {
		const vorpal = require('@offirmo/cli-toolbox/framework/vorpal')
	}
))
////////////////////////////////////
sequence = sequence.then(() => demo(
	'fs/json',
	[ 'load-json-file', 'write-json-file' ],
	() => {
		const json = require('@offirmo/cli-toolbox/fs/json')

		return json.read(__dirname + '/../../package.json').then(data => console.log(data.repository))
	}
))
////////////////////////////////////
sequence = sequence.then(() => demo(
	'fs/extra',
	'fs-extra',
	() => {
		const fs = require('@offirmo/cli-toolbox/fs/extra')

		const dirs = fs.lsDirs(__dirname + '/../..')
		console.log(dirs)
	}
))
////////////////////////////////////
sequence = sequence.then(() => demo(
	'stdout/clear-cli',
	'https://github.com/sindresorhus/clear-cli',
	() => {
		const clearCli = require('@offirmo/cli-toolbox/stdout/clear-cli')

		//clearCli()
	}
))
////////////////////////////////////
sequence = sequence.then(() => demo(
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
))
////////////////////////////////////
sequence = sequence.then(() => demo(
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
))
////////////////////////////////////
sequence = sequence.then(() => demo(
	'string/fancy/ansi_colors',
	'listr',
	() => {
		const ansi_colors = require('@offirmo/cli-toolbox/string/fancy/ansi_colors')

		console.log(ansi_colors.fg.getRgb(2,3,4) + ansi_colors.bg.getRgb(4,4,4) + 'Hello world!' + ansi_colors.reset)
	}
))
////////////////////////////////////
sequence = sequence.then(() => demo(
	'string/fancy/make_sparkline',
	'sparkly',
	() => {
		const make_sparkline = require('@offirmo/cli-toolbox/string/fancy/make_sparkline')

		console.log(make_sparkline([1, 2, 3, 4, 5, 6, 7, 8, 9], {style: 'fire'}))
	}
))
////////////////////////////////////
sequence = sequence.then(() => demo(
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
))
////////////////////////////////////
sequence = sequence.then(() => demo(
	'string/stylize-string',
	'chalk',
	//'',
	() => {
		const stylizeString = require('@offirmo/cli-toolbox/string/stylize')

		console.log(stylizeString.bold.yellow.bgBlue('Hello'))
		console.log(stylizeString.red('red'), stylizeString.red.bold('bold'))
		console.log(stylizeString.green('green'), stylizeString.green.bold('green'))
		console.log(stylizeString.yellow('yellow'), stylizeString.yellow.bold('yellow'))
		console.log(stylizeString.blue('blue'), stylizeString.blue.bold('blue'))
		console.log(stylizeString.magenta('magenta'), stylizeString.magenta.bold('magenta'))
		console.log(stylizeString.cyan('cyan'), stylizeString.cyan.bold('cyan'))
		console.log(stylizeString.white('white'), stylizeString.white.bold('white'))
		console.log(stylizeString.gray('gray'), stylizeString.gray.bold('gray'))
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
sequence = sequence.then(() => demo(
	'string/boxify',
	'boxen',
	//'https://github.com/sindresorhus/boxen',
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
))
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
sequence = sequence.then(() => {
	const style = require('ansi-styles')
	const json = require('@offirmo/cli-toolbox/fs/json')

	// hard style values for no-deps
	//return json.write('style.json', style)
})
////////////////////////////////////
sequence = sequence.then(() => console.log(`~~~ All done, thank you ! ~~~`))
////////////////////////////////////
