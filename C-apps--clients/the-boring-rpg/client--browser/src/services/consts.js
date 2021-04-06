'use strict'

import { StorageKey } from '@tbrpg/flux'

/////////////////////////////////////////////////

const LIB = 'the-boring-rpg'

const LS_KEYS = {
	last_version_seen: `${LIB}.last_version_seen`,
	savegame: StorageKey['bkp_main'],
}

export {
	LIB,
	LS_KEYS,
}
