import { Immutable } from '@offirmo-private/ts-types'
import { UUID } from '@offirmo-private/uuid'
import { Document } from '@offirmo-private/rich-text-format'
import { Element } from '@tbrpg/definitions'
import { Item } from '@tbrpg/state--inventory'
import { PendingEngagement } from '@oh-my-rpg/state-engagement'
import { AchievementSnapshot } from '@tbrpg/state--progress'
import {
	Adventure,
	State,
	UState,
} from '@tbrpg/state'
import * as selectors from '@tbrpg/state'
import { Action } from '@tbrpg/interfaces'

import { Store } from '../types'
import { get_actions_for_element } from './get_actions'


interface Queries {
	get_item(
		uuid: UUID, state: Immutable<State>
	): Item | null
	appraise_item_value(
		uuid: UUID, state: Immutable<State>
	): number
	appraise_item_power(
		uuid: UUID, state: Immutable<State>
	): number
	find_element(
		uuid: UUID, state: Immutable<State>
	): Immutable<Element> | Immutable<AchievementSnapshot> | null
	get_actions_for_element(
		uuid: UUID, state: Immutable<State>
	): Action[]
	get_oldest_pending_flow_engagement(
		state: Immutable<State>
	): { uid: number, $doc: Document, pe: PendingEngagement } | null
	get_oldest_pending_non_flow_engagement(
		state: Immutable<State>
	): { uid: number, $doc: Document, pe: PendingEngagement } | null
	get_achievements_snapshot(
		state: Immutable<State>
	): Immutable<AchievementSnapshot>[]
	get_available_energy_float(
		state: Immutable<State>
	): number
	get_human_time_to_next_energy(
		state: Immutable<State>
	): string
	get_achievements_completion(
		state: Immutable<State>
	): [number, number]
	get_last_adventure(
		state: Immutable<State>
	): Immutable<Adventure> | null
	get_recap(
		state: Immutable<State>
	): Document
	is_inventory_full(
		state: Immutable<State>
	): boolean
	get_available_classes(
		state: Immutable<State>
	): string[]
	// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html
	get_sub_state<K extends keyof UState>(
		key: K, state: Immutable<State>
	): UState[K]
}
function get_queries(store: Store)/*: Queries*/ {
	return {
		get_item(uuid: UUID, state: Immutable<State> = store.get()): Item | null {
			return selectors.get_item(state.u_state, uuid)
		},
		appraise_item_value(uuid: UUID, state: Immutable<State> = store.get()): number {
			return selectors.appraise_item_value(state.u_state, uuid)
		},
		appraise_item_power(uuid: UUID, state: Immutable<State> = store.get()): number {
			return selectors.appraise_item_power(state.u_state, uuid)
		},
		find_element(uuid: UUID, state: Immutable<State> = store.get()): Immutable<Element> | Immutable<AchievementSnapshot> | null {
			return selectors.find_element(state.u_state, uuid)
		},
		get_actions_for_element(uuid: UUID, state: Immutable<State> = store.get()): Action[] {
			return get_actions_for_element(state.u_state, uuid)
		},
		get_oldest_pending_flow_engagement(state: Immutable<State> = store.get()): { uid: number, $doc: Document, pe: PendingEngagement } | null {
			return selectors.get_oldest_pending_flow_engagement(state.u_state)
		},
		get_oldest_pending_non_flow_engagement(state: Immutable<State> = store.get()): { uid: number, $doc: Document, pe: PendingEngagement } | null {
			return selectors.get_oldest_pending_non_flow_engagement(state.u_state)
		},
		get_achievements_snapshot(state: Immutable<State> = store.get()): Immutable<AchievementSnapshot[]> {
			return selectors.get_achievements_snapshot(state.u_state)
		},
		get_available_energy_float(state: Immutable<State> = store.get()): number {
			return selectors.get_available_energy_float(state.t_state)
		},
		get_human_time_to_next_energy(state: Immutable<State> = store.get()): string {
			return selectors.get_human_time_to_next_energy(state)
		},
		get_achievements_completion(state: Immutable<State> = store.get()): [number, number] {
			return selectors.get_achievements_completion(state.u_state)
		},
		get_last_adventure(state: Immutable<State> = store.get()): Immutable<Adventure> | null {
			return state.u_state.last_adventure
		},
		get_recap(state: Immutable<State> = store.get()): Document {
			return selectors.get_recap(state.u_state)
		},
		is_inventory_full(state: Immutable<State> = store.get()): boolean {
			return selectors.is_inventory_full(state.u_state)
		},
		get_available_classes(state: Immutable<State> = store.get()): string[] {
			return selectors.get_available_classes(state.u_state)
		},
		// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html
		get_sub_state<K extends keyof UState>(key: K, state: Immutable<State> = store.get()): Immutable<UState>[K] {
			return state.u_state[key]
		},
	}
}

export {
	Document,
	get_queries,
}
