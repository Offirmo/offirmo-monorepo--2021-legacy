// this is not really a store, but close enough

import stable_stringify from 'json-stable-stringify'
import { OMRContext } from '@oh-my-rpg/definitions'
import { State } from '@tbrpg/state'
import { TbrpgStorage, StorageKey } from '@tbrpg/interfaces'

import { LIB } from '../../consts'
import { PersistentStore } from '../types'
import { SoftExecutionContext } from '../../sec'


function create(SEC: SoftExecutionContext, storage: TbrpgStorage): PersistentStore {
	return SEC.xTry(`[${LIB}/PersistentStore] creating`, ({SEC, logger}: OMRContext) => {
		let last_persisted_state: State | null = null

		last_persisted_state = SEC.xTryCatch(`loading existing savegame`, ({logger}: OMRContext): State | null => {
			logger.verbose(`[${LIB}/LSStore] savegame storage key = "${StorageKey.savegame}"`)

			// LS access can throw
			let ls_content = storage.get_item(StorageKey.savegame)
			if (!ls_content)
				return null

			const recovered_state = JSON.parse(ls_content)

			// need this check due to some serializations returning {} for empty
			const is_empty_state: boolean = !recovered_state || Object.keys(recovered_state).length === 0
			if (is_empty_state)
				return null

			logger.verbose(`[${LIB}/LSStore] restored state =`, { snapshot: JSON.parse(ls_content) })

			// backup before imminent changes
			storage.set_item(StorageKey['savegame-bkp'], stable_stringify(recovered_state))

			return recovered_state
		})

		function persist(new_state: State): void {
			if (last_persisted_state && new_state.u_state === last_persisted_state.u_state) return // no need

			// by version
			if (last_persisted_state && last_persisted_state.schema_version !== new_state.schema_version) {
				const minus1 = stable_stringify(last_persisted_state)
				const minus2 = storage.get_item(StorageKey['savegame-bkp-m1'])

				storage.set_item(StorageKey['savegame-bkp-m1'], minus1)
				if (minus2)
					storage.set_item(StorageKey['savegame-bkp-m2'], minus2)
			}

			const storage_value = stable_stringify(new_state)
			logger.log(`[${LIB}/PersistentStore] 💾 saving #${new_state.u_state.revision}...`, { snapshot: JSON.parse(storage_value) })
			storage.set_item(StorageKey.savegame, storage_value)
			last_persisted_state = new_state
		}

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
			dispatch() { /* unneeded */ },
			get: () => last_persisted_state!
		}
	})
}

export default create
export {
	PersistentStore,
	create,
}
