import assert from 'tiny-invariant'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'

import {
	NUMERIC_VERSION,
	State,
} from '@tbrpg/state'

import {
	Action,
	SyncParams,
	SyncResult,
	Method,
} from '@tbrpg/interfaces'

import { OMRSoftExecutionContext } from '../../sec'
import { hash_state } from '../../utils/hash-state'
import { JsonRpcCaller } from './types'
import logger from './logger'
import fetch from "../../utils/fetch";

////////////////////////////////////

type CloudState =
	| 'starting'
	| 'idle' // TODO check if needed
	| 'syncing' // nominal state
	| 'offline' // to avoid costly server calls, we'll do GET to the server while offline
	| 'defected' // sth. unrecoverable happened, ex. mismatching versions

interface Synchronizer {
	sync: (new_pending_actions: Action[], current_state: State) => void,
}

////////////////////////////////////

function create({ SEC, call_remote_procedure, on_successful_sync, initial_pending_actions, initial_state }: {
	SEC: OMRSoftExecutionContext,
	call_remote_procedure: JsonRpcCaller,
	on_successful_sync: (result: SyncResult) => void,
	initial_pending_actions: Action[],
	initial_state: State,
 }): Readonly<Synchronizer> {
	let state: CloudState = 'offline'
	let pending_actions: Action[] = initial_pending_actions
	let last_known_state_hash: string = hash_state(initial_state)
	let in_flight: Promise<any> | null = null
	let pulse_count = 0

	function call_remote_sync(pending_actions: Action[], current_state_hash: string): Promise<SyncResult> {
		return call_remote_procedure<SyncParams, SyncResult>({
			SEC,
			method: Method.sync,
			params: {
				numver: NUMERIC_VERSION,
				pending_actions,
				current_state_hash,
			},
		})
	}

	let last_offline_check: TimestampUTCMs = 0
	async function check_online(): Promise<number | undefined> {
		const now = get_UTC_timestamp_ms()
		logger.trace(`check_online()…`, { in_flight: !!in_flight, now, elapsed_since_last_attempt: now - last_offline_check })
		if (in_flight)
			return
		if (now - last_offline_check < 5000)
			return

		const p = Promise.race([
			new Promise((resolve, reject) => setTimeout(() => {
				reject(new Error('Timeout!'))
			}, 5000)),
			fetch('./build.json'),
		])

		in_flight = p
		last_offline_check = now

		try {
			const res0 = await p
			const res = await res0.json()
			return res.NUMERIC_VERSION
		}
		catch (err) {
			logger.error('check_online() failed, waiting for auto retry!', { err })
			throw err
		}
		finally {
			assert(in_flight === p)
			in_flight = null
		}
	}

	let last_sync_attempt: TimestampUTCMs = 0
	let last_successful_sync: TimestampUTCMs = 0
	async function do_sync(): Promise<void> {
		const now = get_UTC_timestamp_ms()
		logger.trace(`do_sync()…`, { in_flight: !!in_flight, now, elapsed_since_last_attempt: now - last_sync_attempt })
		if (in_flight)
			return
		if (pending_actions.length === 0 && now - last_sync_attempt < 5000)
			return

		const p = call_remote_sync(pending_actions, last_known_state_hash)
		in_flight = p
		last_sync_attempt = now

		try {
			const result: SyncResult = await p
			console.log('sync res', result)

			on_successful_sync(result)

			if (result.common.numver !== NUMERIC_VERSION) {
				// TODO UI!
				state = 'defected'
				return
			}

			pending_actions = pending_actions.filter(action => action.time > result.processed_up_to_time)
			last_successful_sync = get_UTC_timestamp_ms()
			setTimeout(pulse.bind(null, 'sync success'), 0)
		}
		catch (err) {
			logger.error('sync failed, waiting for auto retry!', { err })
			throw err
		}
		finally {
			assert(in_flight === p)
			in_flight = null
		}
	}

	function pulse(caller: string) {
		pulse_count++
		if (pulse_count > 10) return // safety during dev TODO remove

		logger.group(`——— 📡  pulse #${pulse_count} [${caller}]…`)
		const now = get_UTC_timestamp_ms()
		logger.log(`current state:`, {
			//pulse_count,
			pending_actions,
			last_offline_check,
			last_successful_sync,
			last_known_state_hash,
			now,
		})

		let has_work_left = true

		while (has_work_left) {
			has_work_left = false

			logger.trace(`working…`, { state, in_flight: !!in_flight, })

			switch (state) {
				case 'offline' :
					check_online()
						.then((SERVER_NUMERIC_VERSION: number | undefined) => {
							if (!SERVER_NUMERIC_VERSION) return
							logger.info(`check_online() success with result:`, { SERVER_NUMERIC_VERSION })
							if (SERVER_NUMERIC_VERSION !== NUMERIC_VERSION) {
								// TODO tell the user
								logger.error(`check_online() reported we are outdated!`, { SERVER_NUMERIC_VERSION, NUMERIC_VERSION })
								state = 'defected'
							}
							else if (state === 'offline') {
								state = 'starting'
								setTimeout(pulse.bind(null, 'now online'), 0)
							}
						})
					break

				case 'starting':
					assert(last_known_state_hash, 'state hash')
					assert(!in_flight, 'no sync yet')

					// systematically force a sync straight away
					// even if nothing pending
					// so that we get the latest version of the state if modified remotely
					state = 'syncing'
					has_work_left = true
					break

				case 'idle':
					if (pending_actions.length || now - last_successful_sync > 60_000) {
						state = 'syncing'
						has_work_left = true
						break
					}

					break

				case 'syncing':
					if (pending_actions.length === 0 && now - last_successful_sync > 60_000 ) {
						state = 'idle'
						has_work_left = true
						break
					}

					do_sync()
					break

				case 'defected':
					// no longer do anything
					break

				default:
					throw new Error(`Cloud sync unknown state "${state}"!`)
			}
		}

		logger.trace(`no more work ✓`, { state, in_fligt: !!in_flight })

		logger.groupEnd()
	}

	setTimeout(pulse.bind(null, 'init'), 0)

	// auto plan a periodic retry
	setInterval(pulse.bind(null, 'periodic'), 5000)

	////////////////////////////////////

	return {
		sync(new_pending_actions: Action[], current_state: State): void {
			pending_actions = new_pending_actions
			last_known_state_hash = hash_state(current_state)
			setTimeout(pulse.bind(null, 'sync requested'), 0)
		},
	}
}

export {
	Synchronizer,
	create,
}
