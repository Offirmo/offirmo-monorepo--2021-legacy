import { Enum } from 'typescript-string-enums'

const StorageKey = Enum(
	'savegame',
	'savegame-bkp',
	'savegame-bkp-m1',
	'savegame-bkp-m2',

	'cloud.pending-actions',
)
type StorageKey = Enum<typeof StorageKey> // eslint-disable-line no-redeclare

interface TbrpgStorage {
	warm_up: () => Promise<void>
	cool_down: () => Promise<void>

	set_item: (key: StorageKey, data: string) => void,
	get_item: (key: StorageKey) => string | null,
}

export {
	StorageKey,
	TbrpgStorage,
}
