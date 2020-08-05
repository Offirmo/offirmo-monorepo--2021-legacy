'use strict'

const PromiseWithProgress = require('p-progress')
const is_promise = require('is-promise')

const LIB = '@oh-my-rpg/view-chat'

function is_step_input(step) {
	return step && step.type.startsWith('ask_')
}

function create({
	DEBUG,
	gen_next_step,
	ui,
	inter_msg_delay_ms = 0,
	after_input_delay_ms = 0,
	to_prettified_str = x => x, // work with browser
}) {
	if (DEBUG) console.log('↘ create()')

	function create_dummy_progress_promise({DURATION_MS = 2000, PERIOD_MS = 100} = {}) {
		return new PromiseWithProgress((resolve, reject, progress) => {
			let count = 0
			const auto_pulse = setInterval(() => {
				count++
				const completion_rate = 1. * (count * PERIOD_MS) / DURATION_MS
				progress(completion_rate)

				if (completion_rate >= 1) {
					clearInterval(auto_pulse)
					resolve()
				}
			}, PERIOD_MS)
		})
	}

	function normalize_step(step) {
		try {
			if (step.type === 'ask_for_confirmation' && step !== STEP_CONFIRM)
				step = Object.assign(
					{},
					STEP_CONFIRM,
					step,
				)

			if (!step.msg_main)
				throw new Error(`${LIB}: Step is missing main message!`)

			if (!step.type) {
				if (!step.choices)
					throw new Error(`${LIB}: Step type is unknown and not inferrable!`)

				step.type = 'ask_for_choice'
			}

			step = Object.assign(
				{
					validator: null,
					choices: [],
				},
				step,
			)

			step.choices = step.choices.map(normalize_choice)

			if (step.choices.length) {
				const known_values = new Set()
				step.choices.forEach((choice, index) => {
					if (known_values.has(choice.value)) {
						const err = new Error(`${LIB}: colliding choices with the same value!`)
						err.details = {
							choice,
							value: choice.value,
							index,
						}
						throw err
					}
					known_values.add(choice.value)
				})
			}


			return step
		}
		catch (e) {
			console.error(to_prettified_str(step))
			throw e
		}
	}

	function normalize_choice(choice) {
		// TODO auto-id
		try {
			if (!choice.hasOwnProperty('value') || typeof choice.value === 'undefined')
				throw new Error('Choice has no value!')
			choice.msg_cta = choice.msg_cta || String(choice.value)
			return choice
		}
		catch (e) {
			console.error(to_prettified_str(choice))
			throw e
		}
	}

	async function ask_user(step) {
		if (DEBUG) console.log('↘ ask_user(\n', to_prettified_str(step, {outline: true}), '\n)')

		let answer = ''
		const ok = true // TODO used for confirmation
		do {
			await ui.display_message({msg: step.msg_main, choices: step.choices})
			answer = await ui.read_answer(step)
			if (DEBUG) console.log(`↖ ask_user(…) answer = "${answer}"`)
		} while (!ok)
		await ui.pretend_to_think(after_input_delay_ms)

		let acknowledged = false
		if (step.choices.length) {
			const selected_choice = step.choices.find(choice => choice.value === answer)
			if (selected_choice.msgg_acknowledge) {
				await ui.display_message({msg: selected_choice.msgg_acknowledge(answer)})
				acknowledged = true
			}
		}
		if (!acknowledged && step.msgg_acknowledge) {
			await ui.display_message({msg: step.msgg_acknowledge(answer)})
			acknowledged = true
		}
		if (!acknowledged) {
			// Fine! It's optional.
			if (DEBUG) console.warn('You may want to add an acknowledge message to this step.')
		}

		return answer
	}

	async function execute_step(step) {
		if (DEBUG) console.log('↘ execute_step(\n', to_prettified_str(step, {outline: true}), '\n)')

		switch (step.type) {
			case 'simple_message':
				await ui.pretend_to_think(inter_msg_delay_ms)
				await ui.display_message({ msg: step.msg_main })
				break

			case 'progress':
				await ui.display_progress({
					progress_promise: step.progress_promise
							|| create_dummy_progress_promise({ DURATION_MS: step.duration_ms }),
					msg: step.msg_main,
					msgg_acknowledge: step.msgg_acknowledge,
				})
					.then(() => true, () => false)
					.then(success => {
						if (step.callback)
							step.callback(success)
					})
				break

			case 'ask_for_confirmation':
			case 'ask_for_string':
			case 'ask_for_choice': {
				await ui.pretend_to_think(inter_msg_delay_ms)
				const answer = await ask_user(step)

				let reported = false
				if (step.choices.length) {
					const selected_choice = step.choices.find(choice => choice.value === answer)
					if (selected_choice.callback) {
						await selected_choice.callback(answer)
						reported = true
					}
				}
				if (!reported && step.callback) {
					await step.callback(answer)
					reported = true
				}
				if (!reported) {
					const err = new Error('CNF reporting callback in ask for result!')
					err.step = step
					throw err
				}
				return answer
			}
			default:
				throw new Error(`Unsupported step type: "${step.type}"!`)
		}
	}

	async function start() {
		if (DEBUG) console.log('↘ start()')
		try {
			await ui.setup()
			let should_exit = false
			let last_step = undefined // just in case
			let last_answer = undefined // just in case
			do {
				const step_start_timestamp_ms = +new Date()
				const yielded_step = gen_next_step.next({last_step, last_answer})

				// just in case the returned step is a promise.
				const {value: raw_step, done} = is_promise(yielded_step)
					? await ui.spin_until_resolution(yielded_step)
					: yielded_step

				if (done) {
					should_exit = true
					continue
				}

				const step = normalize_step(raw_step)
				const elapsed_time_ms = (+new Date()) - step_start_timestamp_ms
				if (is_step_input(last_step)) {
					// pretend to have processed the user answer
					await ui.pretend_to_think(Math.max(0, after_input_delay_ms - elapsed_time_ms))
				}

				last_answer = await execute_step(step)
				last_step = step
			} while (!should_exit)
			await ui.teardown()
		}
		catch (e) {
			await ui.teardown()
			throw e
		}
	}

	return {
		start,
	}
}



module.exports = {
	PromiseWithProgress,
	create,
}
