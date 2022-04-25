'use strict'

///////////////////////////////////////////////////////

const path = require('path')
const { spawn } = require('cross-spawn')
const tildify = require('tildify')
const { flatten, map, split, isArray } = require('lodash')

const { EXECUTABLE, find_tsc } = require('./find-tsc')
const { LIB } = require('./consts')
const { set_banner, display_banner_if_1st_output } = require('./logger')

///////////////////////////////////////////////////////

const spawn_options = {
	env: process.env,
}
const RADIX = EXECUTABLE

///////////////////////////////////////////////////////

function compile(tscOptions, files, options) {
	tscOptions = tscOptions || {}
	files = files || []
	options = options || {}
	options.verbose = Boolean(options.verbose)
	set_banner(options.banner)


	if (options.verbose) display_banner_if_1st_output()


	return new Promise((resolve, reject) => {
		let stdout = ''
		let stderr = ''
		let already_failed = false
		function on_failure(reason, err) {
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

			err = err || new Error(`${reason_from_stdout || reason}`)
			err.stdout = stdout
			err.stderr = stderr
			err.reason = reason

			if (options.verbose) {
				display_banner_if_1st_output()
				console.error(`[${LIB}] ✖ Failure during tsc invocation: ${reason}`)
				console.error(err)
			}

			display_banner_if_1st_output()
			err.message = `[${LIB}@dir:${path.parse(process.cwd()).base}] ${err.message}`
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
				.then(tsc_executable_absolute_path => {
					if (options.verbose) console.log(`[${LIB}] ✔ found a typescript compiler at this location: "${tsc_executable_absolute_path}" aka. "${tildify(tsc_executable_absolute_path)}"`)
					if (options.verbose) console.log(`[${LIB}] ► now spawning the compilation command: "${[tsc_executable_absolute_path, ...spawn_params].join(' ')}"...\n`)

					const spawn_instance = spawn(tsc_executable_absolute_path, spawn_params, spawn_options)

					// listen to events
					spawn_instance.on('error', err => {
						on_failure('Spawn: got event "err"', err)
					})
					spawn_instance.on('disconnect', () => {
						display_banner_if_1st_output()
						console.log(`[${LIB}] Spawn: got event "disconnect"`)
					})
					spawn_instance.on('exit', (code, signal) => {
						if (code === 0)
							resolve(stdout)
						else
							on_failure(`Spawn: got event "exit" with error code "${code}" & signal "${signal}"!`)
					})
					spawn_instance.on('close', (code, signal) => {
						if (code === 0)
							resolve(stdout)
						else
							on_failure(`Spawn: got event "close" with error code "${code}" & signal "${signal}"`)
					})

					// for debug purpose only
					spawn_instance.stdin.on('data', data => {
						display_banner_if_1st_output()
						console.log(`[${LIB}] got stdin event "data": "${data}"`)
					})
					// mandatory for correct error detection
					spawn_instance.stdin.on('error', err => {
						on_failure('got stdin event "error"', err)
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
						on_failure('got stdout event "error"', err)
					})

					spawn_instance.stderr.on('data', data => {
						display_banner_if_1st_output()
						split(data, '\n').forEach(line => console.log(RADIX + '! ' + line))
						stderr += data
					})
					// mandatory for correct error detection
					spawn_instance.stderr.on('error', err => {
						on_failure('got stderr event "error"', err)
					})
				})
				.catch(err => on_failure('final catch', err)) // ugly but due to complex "callback style" async code
		}
		catch (err) {
			on_failure(`unexpected global catch`, err)
		}
	})
	.then(stdout => {
		if (options.verbose) console.log(`[${LIB}] ✔ executed successfully.`)
		return stdout
	})
}

///////////////////////////////////////////////////////

module.exports = {
	compile,
}

///////////////////////////////////////////////////////
