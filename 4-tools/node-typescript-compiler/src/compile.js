'use strict'

///////////////////////////////////////////////////////

const { spawn } = require('child_process')
const tildify = require('tildify')
const { flatten, map, split, isArray } = require('lodash')

const { find_tsc } = require('./find-tsc')
const { LIB } = require('./consts')

///////////////////////////////////////////////////////

const spawn_options = {
	env: process.env,
}
const RADIX = 'tsc'

///////////////////////////////////////////////////////

function compile(tscOptions, files, options) {
	tscOptions = tscOptions || {}
	files = files || []
	options = options || {}
	options.verbose = Boolean(options.verbose)
	options.banner = options.banner || 'node-typescript-compiler:'

	return new Promise((resolve, reject) => {

		let stdout = ''
		let stderr = ''
		let already_failed = false
		function fail(reason, err) {
			if (already_failed && !options.verbose)
				return

			stdout = stdout.trim()
			stderr = stderr.trim()

			const reason_from_stdout = (() => {
				const src = stderr || stdout
				const first_line = src.split('\n')[0]
				if (first_line && first_line.toLowerCase().includes('error'))
					return first_line

				return null
			})()

			err = err || new Error(`[${LIB}] ${reason_from_stdout || reason}`)
			err.stdout = stdout
			err.stderr = stderr
			err.reason = reason

			if (options.verbose) {
				console.error(`[${LIB}] Failure during tsc invocation: "${reason}"`)
				console.error(err)
			}

			reject(err)
			already_failed = true
		}

		try {
			const tsc_options_as_array = flatten(map(tscOptions, (value, key) => {
				if (value === false)
					return []
				if (value === true)
					return [ `--${key}` ]
				if (isArray(value))
					value = value.join(',')
				return [ `--${key}`, value ]
			}))
			const spawn_params = tsc_options_as_array.concat(files)


			// not returning due to complex "callback style" async code
			find_tsc()
				.then(spawn_executable => {
					if (options.verbose) console.log(`spawning: ${tildify(spawn_executable)} ` + spawn_params.join(' ') + '\n')

					const spawn_instance = spawn(spawn_executable, spawn_params, spawn_options)

					let seen_any_output_yet = false
					function display_banner_if_1st_output() {
						if (seen_any_output_yet) return

						console.log(options.banner)

						seen_any_output_yet = true
					}

					// listen to events
					spawn_instance.on('error', err => {
						fail('Spawn: got event "err"', err)
					})
					spawn_instance.on('disconnect', () => {
						console.log('Spawn: got event "disconnect"')
					})
					spawn_instance.on('exit', (code, signal) => {
						if (code === 0)
							resolve(stdout)
						else
							fail(`Spawn: got event "exit" with error code "${code}" & signal "${signal}"!`)
					})
					spawn_instance.on('close', (code, signal) => {
						if (code === 0)
							resolve(stdout)
						else
							fail(`Spawn: got event "close" with error code "${code}" & signal "${signal}"`)
					})

					// for debug purpose only
					spawn_instance.stdin.on('data', data => {
						console.log(`got stdin event "data": "${data}"`)
					})
					// mandatory for correct error detection
					spawn_instance.stdin.on('error', err => {
						fail('got stdin event "error"', err)
					})

					spawn_instance.stdout.on('data', data => {
						display_banner_if_1st_output()
						split(data, '\n').forEach(line => {
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
					spawn_instance.stdout.on('error', err => {
						fail('got stdout event "error"', err)
					})

					spawn_instance.stderr.on('data', data => {
						display_banner_if_1st_output()
						split(data, '\n').forEach(line => console.log(RADIX + '! ' + line))
						stderr += data
					})
					// mandatory for correct error detection
					spawn_instance.stderr.on('error', err => {
						fail('got stderr event "error"', err)
					})
				})
				.catch(reject) // ugly but due to complex "callback style" async code
		}
		catch (err) {
			fail('global try/catch', err)
		}
	})
}

///////////////////////////////////////////////////////

module.exports = {
	compile,
}

///////////////////////////////////////////////////////
