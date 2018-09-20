'use strict'

///////////////////////////////////////////////////////

const spawn = require('child_process').spawn
const tildify = require('tildify')
const _ = require('lodash')

const { find_tsc } = require('./find-tsc')
const { LIB } = require('./consts')

///////////////////////////////////////////////////////

const spawn_options = {
	env: process.env
}
const RADIX = 'tsc'

///////////////////////////////////////////////////////

function compile(params, files, options) {
	params = params || {}
	files = files || []
	options = options || {}

	return new Promise((resolve, reject) => {

		const options_as_array = _.flatten(_.map(params, (value, key) => {
			if (value === false)
				return []
			if (value === true)
				return [ `--${key}` ]
			if (_.isArray(value))
				value = value.join(',')
			return [ `--${key}`, value ]
		}))
		const spawn_params = options_as_array.concat(files)

		let stdout = ''
		let stderr = ''

		find_tsc()
			.then(spawn_executable => {
				if (options.verbose) console.log(`[${LIB}] spawning ${tildify(spawn_executable)} ` + spawn_params.join(' ') + '\n')
				const spawn_instance = spawn(spawn_executable, spawn_params, spawn_options)

				let seen_any_output_yet = false
				function display_banner_if_1st_output() {
					if (seen_any_output_yet) return

					console.log(options.banner || 'node-typescript-compiler:')

					seen_any_output_yet = true
				}

				let already_failed = false
				function fail(reason) {
					if (already_failed && !options.verbose)
						return

					const err = new Error(reason)
					err.stdout = stdout
					err.stderr = stderr
					if (options.verbose) console.error(err)
					reject(err)
					already_failed = true
				}

				// listen to events
				spawn_instance.on('error', err => {
					fail(`Spawn : got err event : ${err}`)
				})
				spawn_instance.on('disconnect', () => {
					console.log('Spawn : got disconnect')
				})
				spawn_instance.on('exit', (code, signal) => {
					if (code === 0)
						resolve(stdout)
					else
						fail(`Spawn : got event exit with error code "${code}" & signal "${signal}"`)
				})
				spawn_instance.on('close', (code, signal) => {
					if (code === 0)
						resolve(stdout)
					else
						fail(`Spawn : got event close with error code "${code}" & signal "${signal}"`)
				})

				// for debug purpose only
				spawn_instance.stdin.on('data', data => {
					console.log(`[${LIB}] got stdin data event : "${data}"`)
				})
				// mandatory for correct error detection
				spawn_instance.stdin.on('error', error => {
					fail(`[${LIB}] got stdin error event : "${error}"`)
				})

				spawn_instance.stdout.on('data', data => {
					display_banner_if_1st_output()
					_.split(data, '\n').forEach(line => {
						if (!line.length) return // convenience for more compact output

						if (line[0] === '/')
							line = tildify(line) // convenience for readability if using --listFiles

						if (line.slice(-35) === 'Starting incremental compilation...')
							console.log('\n************************************')

						console.log(RADIX + '> ' + line)
					})
					stdout += data
				})
				// mandatory for correct error detection
				spawn_instance.stdout.on('error', error => {
					fail(`[${LIB}] got stdout error event : "${error}"`)
				})

				spawn_instance.stderr.on('data', data => {
					display_banner_if_1st_output()
					_.split(data, '\n').forEach(line => console.log(RADIX + '! ' + line))
					stderr += data
				})
				// mandatory for correct error detection
				spawn_instance.stderr.on('error', error => {
					fail(`[${LIB}] got stderr error event : "${error}"`)
				})
			})
			.catch(reject)
	})
}

///////////////////////////////////////////////////////

module.exports = {
	compile
}

///////////////////////////////////////////////////////
