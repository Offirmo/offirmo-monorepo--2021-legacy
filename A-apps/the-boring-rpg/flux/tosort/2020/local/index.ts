import assert from 'tiny-invariant'
import stable_stringify from 'json-stable-stringify'
import { State } from '@tbrpg/state'
import { Action, TbrpgStorage, StorageKey } from '@tbrpg/interfaces'

import { LIB as ROOT_LIB } from '../../consts'
import { LocalStore } from '../types'
import { OMRSoftExecutionContext } from '../../sec'


function create(SEC: OMRSoftExecutionContext, storage: TbrpgStorage): LocalStore {
	const LIB = `${ROOT_LIB}/PersistentStore`
	return SEC.xTry(`[${LIB}] creating`, ({SEC, logger}) => {
		let last_persisted_state: State | null = null

		last_persisted_state = SEC.xTryCatch('loading existing savegame', ({logger}): State | null => {
			logger.verbose(`[${LIB}] savegame storage key = "${StorageKey.savegame}"`)

			// LS access can throw
			const ls_content = storage.get_item(StorageKey.savegame)
			if (!ls_content)
				return null

			const recovered_state = JSON.parse(ls_content)

			// need this check due to some serializations returning {} for empty
			const is_empty_state: boolean = !recovered_state || Object.keys(recovered_state).length === 0
			if (is_empty_state)
				return null

			logger.verbose(`[${LIB}] restored state`)
			logger.trace(`[${LIB}] restored state =`, { snapshot: JSON.parse(ls_content) })

			// backup before imminent changes
			storage.set_item(StorageKey['savegame-bkp'], stable_stringify(recovered_state))

			return recovered_state
		}) ?? null

		function persist(new_state: State): void {
			if (last_persisted_state && new_state.u_state && new_state.u_state === last_persisted_state.u_state) return // no need

			// backup by version
			if (last_persisted_state && last_persisted_state.schema_version !== new_state.schema_version) {
				const minus1 = stable_stringify(last_persisted_state)
				const minus2 = storage.get_item(StorageKey['savegame-bkp-m1'])

				storage.set_item(StorageKey['savegame-bkp-m1'], minus1)
				if (minus2)
					storage.set_item(StorageKey['savegame-bkp-m2'], minus2)
			}

			const storage_value = stable_stringify(new_state)
			logger.log(`[${LIB}] 💾 saving #${new_state.u_state.revision}...`)
			storage.set_item(StorageKey.savegame, storage_value)
			last_persisted_state = new_state
			logger.trace(`[${LIB}] 💾 saved #${new_state.u_state.revision}`, { snapshot: JSON.parse(storage_value) })
		}

		// TODO evaluate
		// small optim for it seems accessing LS is blocking the event loop
		let pending_persist_state: State | null = null
		function optimized_persist(new_state: State): void {
			if (!last_persisted_state)
				return persist(new_state)

			pending_persist_state = new_state
			setTimeout(() => persist(pending_persist_state!), 1100)
		}

		return {
			set: optimized_persist,
			dispatch(action: Readonly<Action>, eventual_state_hint?: Readonly<State>) {
				logger.log(`[${LIB}] ⚡ action dispatched: ${action.type}`)
				assert(eventual_state_hint, `[${LIB}] need dispatch hint!`)
				optimized_persist(eventual_state_hint!)
			},
			get: () => last_persisted_state,
		}
	})
}

export default create
export {
	LocalStore,
	create,
}
