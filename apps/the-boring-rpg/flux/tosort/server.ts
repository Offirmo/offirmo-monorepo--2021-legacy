import { Storage } from '@offirmo-private/ts-types'
import { TbrpgStorage, StorageKey } from '@tbrpg/interfaces'

import create_in_memory_store from '../in-memory'
import create_persistent_store from '../persistent'




interface ServerCreationParams {
	storage: TbrpgStorage
}

function create({ storage }: ServerCreationParams) {


	function sync() {

	}

	return {
		sync,
	}
}
