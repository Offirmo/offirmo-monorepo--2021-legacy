import { TbrpgStorage } from '@tbrpg/interfaces'
import { StorageKey } from "@tbrpg/interfaces/src";

function create(): TbrpgStorage {
	const data: { [k: string]: string | null } = {}

	return {
		async warm_up() {},
		async cool_down() {},
		set_item(key: StorageKey, value: string) {
			data[key] = value
		},
		get_item(key: StorageKey) {
			return data[key]
		},
	}
}

export default create
