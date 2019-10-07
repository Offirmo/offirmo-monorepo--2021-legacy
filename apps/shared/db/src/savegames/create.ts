import assert from 'tiny-invariant'

import get_db from '../db'
import { BaseSavegame, SaveGame } from './types'
import { TABLE_TBRPG_SAVEGAMES } from './consts'


export async function create_savegame<T>(savegame: Readonly<T>, summary: string, is_touched: boolean, trx: ReturnType<typeof get_db> = get_db()): Promise<SaveGame<T>['id']> {
	const data: BaseSavegame<T> = {
		summary,
		latest: savegame,
		backup: savegame,
		is_touched,
	}
	if (!is_touched) {
		data.last_untouched = savegame
	}

	const [ id ] = await trx(TABLE_TBRPG_SAVEGAMES)
		.insert(data)
		.returning('id')

	assert(id >= 0, 'created savegame id')

	return id
}
