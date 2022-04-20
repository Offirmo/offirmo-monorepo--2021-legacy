import { Immutable } from '@offirmo-private/ts-types'

import * as Character from '@tbrpg/state--character'
import * as Inventory from '@tbrpg/state--inventory'
import * as Progress from '@tbrpg/state--progress'

import { Power } from './types'
import { appraise_powerⵧequipment } from './appraisal--equipment'

export function appraise_powerⵧoverall(
	avatar: Immutable<Character.State>,
	inventory: Immutable<Inventory.State>,
	progress: Immutable<Progress.State>,
): Power {

	const attributes_power = (() => {
		const click_countⵧgood = progress.statistics.good_play_count
		const click_countⵧbad = progress.statistics.bad_play_count

		/*
		//const level = avatar.attributes.level
		const klass = TOTO
		const klass_alignment: 'good' | 'bad' | 'neutral' = TODO
		const klass_seniority = TODO
		const klass_attributes_affinity = TODO
		const klass_power_easing = TODO*/
		return 0
	})()

	const equipment_power = appraise_powerⵧequipment(inventory)

	const party_power = (() => {
		return 0
	})()

	const pet_power = (() => {
		return 0
	})()

	const mount_power = (() => {
		return 0
	})()

	const all_together = attributes_power + equipment_power + party_power + pet_power + mount_power

	return all_together
}
