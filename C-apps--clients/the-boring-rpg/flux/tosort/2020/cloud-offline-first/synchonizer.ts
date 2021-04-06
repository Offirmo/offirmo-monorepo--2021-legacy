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

const IDLE_SYNC_PERIOD_MS = 60_000
const AUTO_PULSE_PERIOD_MS = 5_000

const MAX_PERIOD_ANY_MS = 5_000 // can't spam more of

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
	logger.log(`synchronizer starting…`, { NUMERIC_VERSION })

	function schedule_pulse(caller: string) {
		setTimeout(pulse.bind(null, caller), 0)
	}

	// auto plan a periodic retry
	let auto_pulse_timeout_id: ReturnType<typeof setInterval> | null = setInterval(() => schedule_pulse('periodic'), AUTO_PULSE_PERIOD_MS)

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

	function on_version(numver: number): void {
		if (numver !== NUMERIC_VERSION) {
			// TODO UI!
			logger.error(`a remote op reported we are outdated!`, { SERVER_NUMERIC_VERSION: numver, NUMERIC_VERSION })
			state = 'defected'
		}
	}

	let last_offline_check: TimestampUTCMs = 0
	async function check_online(): Promise<void> {
		const now = get_UTC_timestamp_ms()
		logger.trace(`check_online()…`, { in_flight: !!in_flight, now, elapsed_since_last_attempt: now - last_offline_check })
		if (in_flight)
			return
		if (now - last_offline_check < MAX_PERIOD_ANY_MS)
			return

		const p = Promise.race([
			new Promise((resolve, reject) => setTimeout(() => {
				reject(new Error('Timeout!'))
			}, 5000)),
			fetch(`./build.json?nocache=${now}`),
		])
		in_flight = p
		last_offline_check = now

		try {
			const res0 = await p
			const res = await res0.json()
			on_version(res.NUMERIC_VERSION)

			if (state === 'offline') {
				state = 'starting'
				schedule_pulse('now online')
			}
		}
		catch (err) {
			logger.log('check_online() failed, will auto retry later...', { err })
			throw err
		}
		finally {
			assert(in_flight === p)
			in_flight = null
		}
	}

	let last_sync_attempt: TimestampUTCMs = 0
	let last_successful_sync: TimestampUTCMs = 0
	async function do_sync(force: boolean = false): Promise<void> {
		const now = get_UTC_timestamp_ms()
		logger.trace(`do_sync()…`, { in_flight: !!in_flight, now, elapsed_since_last_attempt: now - last_sync_attempt })
		if (in_flight)
			return
		if (now - last_sync_attempt < MAX_PERIOD_ANY_MS && !force)
			return

		const p = call_remote_sync(pending_actions, last_known_state_hash)
		in_flight = p
		last_sync_attempt = now

		try {
			const result: SyncResult = await p
			logger.trace('do_sync() returned:', { result })

			on_successful_sync(result)
			on_version(result.common.numver)

			pending_actions = pending_actions.filter(action => action.time > result.processed_up_to_time)
			last_successful_sync = get_UTC_timestamp_ms()
			schedule_pulse('sync success')
		}
		catch (err) {
			logger.error('sync failed, waiting for auto retry! X', { err })
			// ALPHA we immediatly bail out
			state = 'defected'
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

		logger.group(`——— 📡 cloud sync pulse #${pulse_count}… ← ${caller}`)
		const now = get_UTC_timestamp_ms()
		logger.trace(`current state:`, {
			//pulse_count,
			pending_actions,
			last_offline_check,
			last_successful_sync,
			last_known_state_hash,
			now,
		})

		let has_work_left = true
		let last_state = state

		while (has_work_left) {
			has_work_left = false // so far

			logger.trace(`working…`, { state, in_flight: !!in_flight, })

			switch (state) {
				case 'starting':
					assert(last_known_state_hash, 'state hash')
					assert(!in_flight, 'no sync yet')

					// systematically force a sync straight away
					// even if nothing pending
					// so that we get the latest version of the state if modified remotely
					state = 'syncing'
					has_work_left = true
					break

				case 'offline' :
					check_online()
					break

				case 'idle':
					if (pending_actions.length || now - last_successful_sync >= IDLE_SYNC_PERIOD_MS) {
						state = 'syncing'
						has_work_left = true
						break
					}

					break

				case 'syncing':
					if (pending_actions.length === 0 && now - last_successful_sync < IDLE_SYNC_PERIOD_MS ) {
						state = 'idle'
						has_work_left = true
						break
					}

					do_sync()
					break

				case 'defected':
					// no longer do anything
					if (auto_pulse_timeout_id) {
						clearInterval(auto_pulse_timeout_id)
						logger.info(`Will no longer try to sync.`)
						auto_pulse_timeout_id = null
					}
					break

				default:
					throw new Error(`Cloud sync unknown state "${state}"!`)
			}

			if (state !== last_state)
				logger.trace(`state changed…`, { from: last_state, to: state })
		}

		logger.trace(`no more work ✓`, { state, in_fligt: !!in_flight })

		logger.groupEnd()
	}

	schedule_pulse('init')

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
