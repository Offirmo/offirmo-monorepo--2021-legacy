// share code executing a command and returning its output

import spawn from 'cross-spawn'

const MODULE_ID = 'pspawn'
const EXTRA_SETTLING_DELAY_MS = 25 // note: 0 suffice (tested), but let's be extra-careful

function execute(executable, options) {
	options = options || {}
	options.params = options.params || []
	options.timeout = options.timeout || 3000
	options.env = process.env
	options.verbose = Boolean(options.verbose)
	options.logger = options.logger || console
	options.merge_stderr = Boolean(options.merge_stderr)

	const logger = options.logger

	const result = {
		options,
		spawned_command: [executable].concat(options.params).join(' '),
		spawned_command_full: undefined,
		spawn_instance: undefined,
		stdout: '',
		stderr: '',
		success: false,
		is_finished: false,
	}
	result.spawned_command_full = `${result.spawned_command}${options.cwd ? ' @' + options.cwd : ''}`

	options.verbose && logger.log(`${MODULE_ID}: spawning "${result.spawned_command}"…`)
	const spawn_instance = result.spawn_instance = spawn(executable, options.params, options)
	const logradix = `${MODULE_ID}#${spawn_instance.pid}`
	options.verbose && logger.log(`${logradix}: spawned "${result.spawned_command_full}"`)

	return new Promise((resolve, reject) => {

		function finish(err = null) {
			if (result.is_finished) {
				//logger.warn(`${logradix}: double finish !`, `"${result.spawned_command}"`)
				return
			}
			result.is_finished = true

			// there is a race condition between event handlers
			// give them a bit of time to settle (especially the stdout/stderr one)
			setTimeout(() => {
				result.stdout = result.stdout.trim()
				result.stderr = result.stderr.trim()

				if (result.stderr && !err)
					err = new Error(`got stderr: ${result.stderr}`)

				if (err) {
					result.err = err
					result.err.spawned_command_full = result.spawned_command_full
					result.err.stderr = result.stderr
					result.err.stdout = result.stdout
					options.verbose && logger.error(`${logradix}: ended on error\n"${result.spawned_command}"`, err)
				}
				else {
					result.success = true
				}

				resolve(result)
			}, EXTRA_SETTLING_DELAY_MS)
		}

		spawn_instance.on('error', err => {
			options.verbose && logger.log(`${logradix}: got err:`, err)
			finish(err)
		})
		spawn_instance.on('close', (code, signal) => {
			options.verbose && logger.log(`${logradix}: got event close with code "${code}" & signal "${signal}"`)
			if (code !== 0)
				finish(new Error(`${MODULE_ID}: child process #${spawn_instance.pid} closed with code ${code}`))
			else
				finish()
		})
		spawn_instance.on('disconnect', () => {
			options.verbose && logger.log(`${logradix}: got disconnect`)
			finish()
		})
		spawn_instance.on('exit', (code, signal) => {
			options.verbose && logger.log(`${logradix}: got event exit with code "${code}" & signal "${signal}"`)
			if (code !== 0)
				finish(new Error(`${MODULE_ID}: child process #${spawn_instance.pid} exited with code ${code}`))
			else
				finish()
		})

		if (spawn_instance.stdin) {
			spawn_instance.stdin.on('data', data => {
				options.verbose && logger.log(`${logradix}: got stdin data event : "${data}"`)
			})
			spawn_instance.stdin.on('error', err => {
				options.verbose && logger.log(`${logradix}: got stdin error event : "${err}"`)
				finish(err)
			})
		}

		if (spawn_instance.stdout) {
			spawn_instance.stdout.on('data', data => {
				options.verbose && logger.log(`${logradix}: got stdout data event : "${data}"`)
				result.stdout += data
			})
			spawn_instance.stdout.on('error', err => {
				options.verbose && logger.log(`${logradix}: got stdout error event : "${err}"`)
				finish(err)
			})
		}

		if (spawn_instance.stderr) {
			spawn_instance.stderr.on('data', data => {
				options.verbose && logger.log(`${logradix}: got stderr data event : "${data}"`)
				if (options.merge_stderr)
					result.stdout += data
				else
					result.stderr += data
			})
			spawn_instance.stderr.on('error', err => {
				options.verbose && logger.log(`${logradix}: got stderr error event : "${err}"`)
				finish(err)
			})
		}
	})
}

// "fire and forget" and don't care about the result
function execute_and_forget(executable, options) {
	const res = execute(executable, options)
	// TODO
	return res
}

function execute_and_throw(executable, options) {
	const res = execute(executable, options)

	return res.then(result => {
		if (result.err) throw result.err
		return result
	})
}

export {
	execute,
	execute_and_throw,
}
