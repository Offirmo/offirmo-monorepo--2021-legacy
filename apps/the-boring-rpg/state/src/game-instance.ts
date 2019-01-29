/* A helper for actual games using this model
 * TODO extract
 * TODO force refresh on client state change
 */

import EventEmitter from 'emittery'
import deep_merge from 'deepmerge'

import { UUID } from '@offirmo/uuid'
import { Document } from '@offirmo/rich-text-format'

import { Element } from '@oh-my-rpg/definitions'
import { CharacterClass } from '@oh-my-rpg/state-character'
import { Item } from '@oh-my-rpg/state-inventory'
import { PendingEngagement } from "@oh-my-rpg/state-engagement"
import * as PRNGState from '@oh-my-rpg/state-prng'
import { AchievementSnapshot } from '@oh-my-rpg/state-progress'

import { Adventure, State, UState } from './types'
import * as state_fns from './state'
import * as selectors from './selectors'
import { migrate_to_latest } from './state/migrations'
import { SoftExecutionContext } from './sec'
import { Action, reduce_action, get_actions_for_element } from './serialization'
import { get_recap } from './engagement'

interface CreateParams<T> {
	SEC: SoftExecutionContext
	get_latest_state: () => State
	persist_state: (state: State) => void
	view_state: T
}

function overwriteMerge<T>(destination: T, source: T): T {
	return source
}

function create_game_instance<T>({SEC, get_latest_state, persist_state, view_state}: CreateParams<T>) {
	return SEC.xTry('creating tbrpg instance', ({SEC, logger}: any) => {

		SEC.xTry('auto creating/migrating', ({SEC, logger}: any) => {
			let state = get_latest_state()

			// need this check due to some serializations returning {} for empty
			const was_empty_state = !state || Object.keys(state).length === 0

			state = was_empty_state
				? state_fns.reseed(state_fns.create(SEC))
				: migrate_to_latest(SEC, state)

			// TODO enqueue in engagement?
			if (was_empty_state) {
				logger.verbose('Clean savegame created from scratch:', {state})
			}
			else {
				logger.trace('migrated state:', {state})
			}

			// re-seed outside of the unit test path
			if (state.u_state.prng.seed === PRNGState.DEFAULT_SEED) {
				// TODO still needed ? Report as error to check.
				state = state_fns.reseed(state)
				logger.warn('re-seeding that shouldn’t be needed!')
			}

			persist_state(state)
		})

		view_state = view_state || ({
			model: get_latest_state(),
		} as any as T)

		const emitter = new EventEmitter()

		const gi = {
			reducers: {
				on_start_session() {
					let state = get_latest_state()
					state = state_fns.on_start_session(state)
					persist_state(state)
					emitter.emit('model_change', 'on_start_session()')
				},
				update_to_now() {
					let state = get_latest_state()
					state = state_fns.update_to_now(state)
					persist_state(state) // TODO refine that
					emitter.emit('model_change', 'update_to_now()')
				},
				play() {
					let state = get_latest_state()
					state = state_fns.play(state)
					persist_state(state)
					emitter.emit('model_change', 'play()')
				},
				equip_item(uuid: UUID) {
					let state = get_latest_state()
					state = state_fns.equip_item(state, uuid)
					persist_state(state)
					emitter.emit('model_change', 'equip_item()')
				},
				sell_item(uuid: UUID) {
					let state = get_latest_state()
					state = state_fns.sell_item(state, uuid)
					persist_state(state)
					emitter.emit('model_change', 'sell_item()')
				},
				rename_avatar(new_name: string) {
					let state = get_latest_state()
					state = state_fns.rename_avatar(state, new_name)
					persist_state(state)
					emitter.emit('model_change', 'rename_avatar()')
				},
				change_avatar_class(new_class: CharacterClass) {
					let state = get_latest_state()
					state = state_fns.change_avatar_class(state, new_class)
					persist_state(state)
					emitter.emit('model_change', 'change_avatar_class()')
				},
				attempt_to_redeem_code(code: string) {
					let state = get_latest_state()
					state = state_fns.attempt_to_redeem_code(state, code)
					persist_state(state)
					emitter.emit('model_change', 'attempt_to_redeem_code()')
				},
				acknowledge_engagement_msg_seen(uid: number) {
					let state = get_latest_state()
					state = state_fns.acknowledge_engagement_msg_seen(state, uid)
					persist_state(state)
					emitter.emit('model_change', 'acknowledge_engagement_msg_seen()')
				},
				execute_serialized_action(action: Action) {
					let state = get_latest_state()
					state = reduce_action(state, action)
					persist_state(state)
					emitter.emit('model_change', `execute_serialized_action(${action.type})`)
				},
			},

			selectors: {
				get_item(uuid: UUID): Item | null {
					let state = get_latest_state()
					return selectors.get_item(state.u_state, uuid)
				},
				appraise_item_value(uuid: UUID): number {
					let state = get_latest_state()
					return selectors.appraise_item_value(state.u_state, uuid)
				},
				appraise_item_power(uuid: UUID): number {
					let state = get_latest_state()
					return selectors.appraise_item_power(state.u_state, uuid)
				},
				find_element(uuid: UUID): Readonly<Element> | Readonly<AchievementSnapshot> | null {
					let state = get_latest_state()
					return selectors.find_element(state.u_state, uuid)
				},
				get_actions_for_element(uuid: UUID): Action[] {
					let state = get_latest_state()
					return get_actions_for_element(state.u_state, uuid)
				},
				get_oldest_pending_flow_engagement(): { uid: number, $doc: Document, pe: PendingEngagement } | null {
					let state = get_latest_state()
					return selectors.get_oldest_pending_flow_engagement(state.u_state)
				},
				get_oldest_pending_non_flow_engagement(): { uid: number, $doc: Document, pe: PendingEngagement } | null {
					let state = get_latest_state()
					return selectors.get_oldest_pending_non_flow_engagement(state.u_state)
				},
				get_achievements_snapshot(): Readonly<AchievementSnapshot>[] {
					let state = get_latest_state()
					return selectors.get_achievements_snapshot(state.u_state)
				},
				get_available_energy_float(): number {
					let state = get_latest_state()
					return selectors.get_available_energy_float(state.t_state)
				},
				get_human_time_to_next_energy(): string {
					let state = get_latest_state()
					return selectors.get_human_time_to_next_energy(state)
				},
				get_achievements_completion(): [number, number] {
					let state = get_latest_state()
					return selectors.get_achievements_completion(state.u_state)
				},
				get_last_adventure(): Readonly<Adventure> | null {
					let state = get_latest_state()
					return state.u_state.last_adventure
				},
				get_recap(): Document {
					let state = get_latest_state()
					return get_recap(state.u_state)
				},
				is_inventory_full(): boolean {
					let state = get_latest_state()
					return selectors.is_inventory_full(state.u_state)
				},
				// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html
				get_sub_state<K extends keyof UState>(key: K): UState[K] {
					let state = get_latest_state()
					return state.u_state[key]
				}
			},

			model: {
				get_state: get_latest_state,

				reset_state() {
					const state = state_fns.reseed(state_fns.create())
					persist_state(state)
					logger.verbose('Savegame reseted:', {state})
					emitter.emit('model_change', 'reset_state()')
				},

				// TODO clean
				subscribe(id: string, fn: () => void): () => void {
					const unbind = emitter.on('model_change', (src: string) => {
						console.log(`🌀 model change reported to subscriber "${id}" (source: ${src})`)
						fn()
					})
					return unbind
				},
			},

			view: {
				// allow managing a transient state
				set_state(fn: (state: T) => Partial<T>): void {
					const changed = fn(view_state)
					console.log('⚡ view change requested', changed)
					view_state = {
						...deep_merge(view_state, changed, { arrayMerge: overwriteMerge }),
						model: get_latest_state(),
					}
					emitter.emit('view_change', 'set_state(…)')
				},

				get_state(): T {
					return view_state
				},
			},

			subscribe(id: string, fn: () => void): () => void {
				const unbind = emitter.on('view_change', (src: string) => {
					console.log(`🌀🌀🌀🌀🌀🌀🌀 root state change reported to subscriber "${id}" (source: view/${src})`)
					fn()
				})
				return unbind
			},
		}

		emitter.on('model_change', (src: string) => {
			view_state = {
				...(view_state as any),
				model: get_latest_state(),
			}
			emitter.emit('view_change', `model.${src}`)
		})

		return gi
	})
}

export {
	CreateParams,
	create_game_instance,
}
