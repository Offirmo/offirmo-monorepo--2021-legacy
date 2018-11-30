/////////////////////

import { Enum } from 'typescript-string-enums'

import { JSONObject, JSONAny } from '@offirmo/ts-types'
import { Random, Engine } from '@offirmo/random'

import { CharacterClass } from '@oh-my-rpg/state-character'
import * as CharacterState from '@oh-my-rpg/state-character'
import * as WalletState from '@oh-my-rpg/state-wallet'
import * as InventoryState from '@oh-my-rpg/state-inventory'
import * as PRNGState from '@oh-my-rpg/state-prng'
import * as EnergyState from '@oh-my-rpg/state-energy'
import * as EngagementState from '@oh-my-rpg/state-engagement'
import * as CodesState from '@oh-my-rpg/state-codes'
import * as ProgressState from '@oh-my-rpg/state-progress'

import { LIB, SCHEMA_VERSION } from '../../consts'
import { State } from '../../types'
import { create } from '../reducers'
import { SoftExecutionContext, OMRContext, get_lib_SEC } from '../../sec'

import {
	rename_avatar,
	change_avatar_class,
} from '../reducers'

/////////////////////

// https://github.com/burakcan/mb
// Exception-free nested nullable attribute accessor
const mb = (...p: string[]) =>
	(o: JSONAny): JSONAny =>
		p.map((c: string) => (o = ((o || {}) as JSONObject)[c])) && o;

const get_name = mb('avatar', 'name')
const get_class = mb('avatar', 'klass')

/////////////////////

function reset_and_salvage(legacy_state: Readonly<JSONObject>): Readonly<State> {
	let state = create()

	const name = get_name(legacy_state)
	if (typeof name !== 'string') {
		console.warn(`${LIB}: may need to update the avatar name salvaging!`)
	}
	else {
		state = rename_avatar(state, name)
	}

	const klass = get_class(legacy_state)
	if (typeof klass !== 'string' || Enum.isType(CharacterClass, klass)) {
		console.warn(`${LIB}: may need to update the avatar name salvaging!`)
	}
	else {
		state = change_avatar_class(state, klass as CharacterClass)
	}


	// still, try to salvage "meta" for engagement
	try {


		// TODO salvage creation date as well?
		// TODO salvage class
		// TODO salvage by auto-replay as much?

		console.info(`${LIB}: salvaged some savegame data.`)
	}
	catch (err) {
		/* swallow */
		console.warn(`${LIB}: salvaging failed!`)
		state = create()
	}
	return state
}

/////////////////////

export {
	reset_and_salvage,
}
