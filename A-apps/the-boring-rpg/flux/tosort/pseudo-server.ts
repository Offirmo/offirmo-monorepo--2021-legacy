import { Storage } from '@offirmo-private/ts-types'
import { TbrpgStorage, StorageKey } from '@tbrpg/interfaces'

import create_in_memory_store from '../in-memory'
import create_persistent_store from '../persistent'





function create({ local_storage }: { local_storage: Storage }) {
	const storage: TbrpgStorage = {
		async warm_up() {},
		async cool_down() {},
		set_item(key: StorageKey, value: string): void {
			local_storage.setItem(`tbrpg.pseudo-server.${key}`, value)
		},
		get_item(key: StorageKey): string | null {
			return local_storage.getItem(`tbrpg.pseudo-server.${key}`)
		},
	}



	function sync() {

	}

	return {
		sync,
	}
}
