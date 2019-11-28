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

import { SoftExecutionContext } from '../../sec'
import { hash_state } from '../../utils/hash-state'
import { JsonRpcCaller } from './types'

////////////////////////////////////

type CloudState =
	'starting'
	| 'idle' // TODO check if needed
	| 'syncing' // nominal state
	| 'offline' // to avoid costly server calls, we'll do GET to the server while offline
	| 'defected' // sth. unrecoverable happened, ex. mismatching versions

interface Synchronizer {
	sync: (new_pending_actions: Action[], current_state: State) => void,
}

////////////////////////////////////

const LIB = '📡 cloud sync'

function create({ SEC, call_remote_procedure, on_successful_sync, initial_pending_actions, initial_state }: {
	SEC: SoftExecutionContext,
	call_remote_procedure: JsonRpcCaller,
	on_successful_sync: (result: SyncResult) => void,
	initial_pending_actions: Action[],
	initial_state: State,
 }): Readonly<Synchronizer> {
	let state: CloudState = 'starting'
	let pending_actions: Action[] = initial_pending_actions
	let last_successful_sync: TimestampUTCMs = 0
	let last_sync_attempt: TimestampUTCMs = 0
	let last_known_state_hash: string = hash_state(initial_state)
	let in_flight_sync: Promise<SyncResult> | null = null

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

	function do_sync(): void {
		if (in_flight_sync)
			return

		in_flight_sync = call_remote_sync(pending_actions, last_known_state_hash)
		last_sync_attempt = get_UTC_timestamp_ms()

		in_flight_sync.then((result: SyncResult) => {
			on_successful_sync(result)

			if (result.common.numver !== NUMERIC_VERSION) {
				state = 'defected'
				return
			}

			pending_actions = pending_actions.filter(action => action.time > result.processed_up_to_time)
			last_successful_sync = get_UTC_timestamp_ms()
		})
			.catch(err => {
				// TODO plan a retry after a while
				throw err
			})
			.finally(() => {
				in_flight_sync = null
				pulse()
			})
	}

	function pulse() {
		console.group(`[${LIB}] pulse…`)

		let has_work_left = true

		while (has_work_left) {
			has_work_left = false

			switch (state) {
				case 'starting':
					// TODO optim: check online + version with GET

					assert(last_known_state_hash, 'state hash')
					assert(!in_flight_sync, 'no sync yet')

					// systematically force a sync straight away
					// so that we get the latest version of the state + version
					do_sync()

					state = pending_actions.length === 0 ? 'idle' : 'syncing'
					has_work_left = true
					break

				case 'idle':
					if (pending_actions.length) {
						state = 'syncing'
						has_work_left = true
						break
					}

					if (get_UTC_timestamp_ms() - last_successful_sync > 60_000) {
						// TODO periodically check for new infos
						console.log(`[${LIB}] TODO: we could check for new infos...`)
					}

					break

				case 'syncing':
					if (pending_actions.length === 0) {
						state = 'idle'
						has_work_left = true
						break
					}
					if (!in_flight_sync)
						do_sync()
					break

				case 'defected':
					// no longer do anything
					break

				default:
					throw new Error(`Cloud sync unknown state "${state}"!`)
			}
		}

		console.groupEnd()
	}

	pulse()

	////////////////////////////////////

	return {
		sync(new_pending_actions: Action[], current_state: State): void {
			pending_actions = new_pending_actions
			last_known_state_hash = hash_state(current_state)
			setTimeout(pulse, 0)
		},
	}
}

export {
	Synchronizer,
	create,
}
