// this is not really a store, but close enough

import { OMRContext } from '@oh-my-rpg/definitions'
import { State } from '@tbrpg/state'
import * as TBRPGState from '@tbrpg/state'

import { PersistentStorage } from '../../types'
import { LIB } from '../../consts'
import { LS_KEYS } from '../consts'
import { SoftExecutionContext } from '../../sec'
import { LocalStorageStore } from '../types'



function get_backup_ls_key(v: number): string {
	return `${LS_KEYS.savegame_backup}.v${v}`
}


function create(SEC: SoftExecutionContext, local_storage: PersistentStorage): LocalStorageStore {
	return SEC.xTry(`[${LIB}/LSStore] creating`, ({SEC, logger}: OMRContext) => {
		let last_persisted_state: State | null = null

		SEC.xTryCatch(`loading existing savegame`, ({logger}: OMRContext): void => {
			logger.verbose(`[${LIB}/LSStore] savegame storage key = "${LS_KEYS.savegame}"`)

			// LS access can throw
			let ls_content = local_storage.getItem(LS_KEYS.savegame)
			if (ls_content)
				last_persisted_state = JSON.parse(ls_content)

			// backup
			local_storage.setItem(LS_KEYS.savegame_backup, JSON.stringify(last_persisted_state))
			if (last_persisted_state && last_persisted_state.schema_version) {
				local_storage.setItem(get_backup_ls_key(last_persisted_state.schema_version), JSON.stringify(last_persisted_state))
				for (let i = last_persisted_state.schema_version - 2; i > 0; --i) {
					const key = get_backup_ls_key(i)
					if (local_storage.getItem(key)) {
						logger.log(`[${LIB}/LSStore] cleaning old backup`, {v: i})
						local_storage.removeItem(key)
					}
				}
			}
		})

		function persist(new_state: State): void {
			if (last_persisted_state && new_state.u_state === last_persisted_state.u_state) return // no need

			logger.info(`[${LIB}/LSStore] 💾 saving #${new_state.u_state.revision}...`)
			local_storage.setItem(LS_KEYS.savegame, JSON.stringify(new_state))
			last_persisted_state = new_state
		}

		return {
			set: persist,
			dispatch() { /* unneeded */ },
			get: () => last_persisted_state!
		}
	})
}

export {
	create,
}
