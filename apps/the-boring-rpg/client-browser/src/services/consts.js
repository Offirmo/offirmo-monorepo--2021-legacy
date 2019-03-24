import { StorageKey } from '@tbrpg/flux'

const LIB = 'the-boring-rpg'

const LS_KEYS = {
	last_version_seen: `${LIB}.last_version_seen`,
	savegame: `${LIB}.${StorageKey.savegame}`,
}

export {
	LIB,
	LS_KEYS,
}
