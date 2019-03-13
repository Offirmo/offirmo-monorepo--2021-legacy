import { UUID } from '@offirmo/uuid'
import { Document } from '@offirmo/rich-text-format'

import { Element } from '@oh-my-rpg/definitions'
import { Item } from '@oh-my-rpg/state-inventory'
import { PendingEngagement } from "@oh-my-rpg/state-engagement"
import { AchievementSnapshot } from '@oh-my-rpg/state-progress'
import {
	Adventure,
	State,
	UState,
} from '@tbrpg/state'
import * as selectors from '@tbrpg/state'

import { Action } from '../actions'
import { InMemoryStore } from '../stores/types'
import { get_actions_for_element } from './get_actions'


function get_queries(in_memory_store: InMemoryStore) {
	return {
		get_item(uuid: UUID, state: Readonly<State> = in_memory_store.get()!): Item | null {
			return selectors.get_item(state.u_state, uuid)
		},
		appraise_item_value(uuid: UUID, state: Readonly<State> = in_memory_store.get()!): number {
			return selectors.appraise_item_value(state.u_state, uuid)
		},
		appraise_item_power(uuid: UUID, state: Readonly<State> = in_memory_store.get()!): number {
			return selectors.appraise_item_power(state.u_state, uuid)
		},
		find_element(uuid: UUID, state: Readonly<State> = in_memory_store.get()!): Readonly<Element> | Readonly<AchievementSnapshot> | null {
			return selectors.find_element(state.u_state, uuid)
		},
		get_actions_for_element(uuid: UUID, state: Readonly<State> = in_memory_store.get()!): Action[] {
			return get_actions_for_element(state.u_state, uuid)
		},
		get_oldest_pending_flow_engagement(state: Readonly<State> = in_memory_store.get()!): { uid: number, $doc: Document, pe: PendingEngagement } | null {
			return selectors.get_oldest_pending_flow_engagement(state.u_state)
		},
		get_oldest_pending_non_flow_engagement(state: Readonly<State> = in_memory_store.get()!): { uid: number, $doc: Document, pe: PendingEngagement } | null {
			return selectors.get_oldest_pending_non_flow_engagement(state.u_state)
		},
		get_achievements_snapshot(state: Readonly<State> = in_memory_store.get()!): Readonly<AchievementSnapshot>[] {
			return selectors.get_achievements_snapshot(state.u_state)
		},
		get_available_energy_float(state: Readonly<State> = in_memory_store.get()!): number {
			return selectors.get_available_energy_float(state.t_state)
		},
		get_human_time_to_next_energy(state: Readonly<State> = in_memory_store.get()!): string {
			return selectors.get_human_time_to_next_energy(state)
		},
		get_achievements_completion(state: Readonly<State> = in_memory_store.get()!): [number, number] {
			return selectors.get_achievements_completion(state.u_state)
		},
		get_last_adventure(state: Readonly<State> = in_memory_store.get()!): Readonly<Adventure> | null {
			return state.u_state.last_adventure
		},
		get_recap(state: Readonly<State> = in_memory_store.get()!): Document {
			return selectors.get_recap(state.u_state)
		},
		is_inventory_full(state: Readonly<State> = in_memory_store.get()!): boolean {
			return selectors.is_inventory_full(state.u_state)
		},
		get_available_classes(state: Readonly<State> = in_memory_store.get()!): string[] {
			return selectors.get_available_classes(state.u_state)
		},
		// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html
		get_sub_state<K extends keyof UState>(key: K, state: Readonly<State> = in_memory_store.get()!): UState[K] {
			return state.u_state[key]
		}
	}
}

export {
	get_queries,
}
