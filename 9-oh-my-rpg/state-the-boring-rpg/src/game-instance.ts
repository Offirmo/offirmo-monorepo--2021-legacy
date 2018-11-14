/* A helper for actual games using this model
 * TODO extract
 * TODO force refresh on client state change
 */

const EventEmitter = require('emittery')
const deep_merge = require('deepmerge').default

import { UUID } from '@offirmo/uuid'
import { Document } from '@offirmo/rich-text-format'

import { Element } from '@oh-my-rpg/definitions'
import { CharacterClass } from '@oh-my-rpg/state-character'
import { Item, get_item } from '@oh-my-rpg/state-inventory'
import { PendingEngagement } from "@oh-my-rpg/state-engagement"
import * as PRNGState from '@oh-my-rpg/state-prng'
import { AchievementSnapshot } from '@oh-my-rpg/state-progress'

import { State } from './types'
import * as state_fns from './state'
import * as selectors from './selectors'
import { migrate_to_latest } from './state/migrations'
import { SoftExecutionContext } from './sec'
import { Action, reduce_action, get_actions_for_element } from './serialization'

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
			if (state.prng.seed === PRNGState.DEFAULT_SEED) {
				// TODO still needed ? Report as error to check.
				state = state_fns.reseed(state)
				logger.warn('re-seeding that shouldn’t be needed!')
			}

			persist_state(state)
		})

		view_state = view_state || ({} as any as T)

		const emitter = new EventEmitter()

		return {
			reducers: {
				play() {
					let state = get_latest_state()
					state = state_fns.play(state)
					persist_state(state)
					emitter.emit('state_change')
				},
				equip_item(uuid: UUID) {
					let state = get_latest_state()
					state = state_fns.equip_item(state, uuid)
					persist_state(state)
					emitter.emit('state_change')
				},
				sell_item(uuid: UUID) {
					let state = get_latest_state()
					state = state_fns.sell_item(state, uuid)
					persist_state(state)
					emitter.emit('state_change')
				},
				rename_avatar(new_name: string) {
					let state = get_latest_state()
					state = state_fns.rename_avatar(state, new_name)
					persist_state(state)
					emitter.emit('state_change')
				},
				change_avatar_class(new_class: CharacterClass) {
					let state = get_latest_state()
					state = state_fns.change_avatar_class(state, new_class)
					persist_state(state)
					emitter.emit('state_change')
				},
				attempt_to_redeem_code(code: string) {
					let state = get_latest_state()
					state = state_fns.attempt_to_redeem_code(state, code)
					persist_state(state)
					emitter.emit('state_change')
				},
				acknowledge_engagement_msg_seen(uid: number) {
					let state = get_latest_state()
					state = state_fns.acknowledge_engagement_msg_seen(state, uid)
					persist_state(state)
					emitter.emit('state_change')
				},
				execute_serialized_action(action: Action) {
					let state = get_latest_state()
					state = reduce_action(state, action)
					persist_state(state)
					emitter.emit('state_change')
				},
			},

			selectors: {
				get_item(uuid: UUID): Item | null {
					let state = get_latest_state()
					return get_item(state.inventory, uuid)
				},
				appraise_item_value(uuid: UUID): number {
					let state = get_latest_state()
					return selectors.appraise_item_value(state, uuid)
				},
				appraise_item_power(uuid: UUID): number {
					let state = get_latest_state()
					return selectors.appraise_item_power(state, uuid)
				},
				find_element(uuid: UUID): Readonly<Element> | Readonly<AchievementSnapshot> | null {
					let state = get_latest_state()
					return selectors.find_element(state, uuid)
				},
				get_actions_for_element(uuid: UUID): Action[] {
					let state = get_latest_state()
					return get_actions_for_element(state, uuid)
				},
				get_oldest_pending_flow_engagement(): { uid: number, $doc: Document, pe: PendingEngagement } | null {
					let state = get_latest_state()
					return selectors.get_oldest_pending_flow_engagement(state)
				},
				get_oldest_pending_non_flow_engagement(): { uid: number, $doc: Document, pe: PendingEngagement } | null {
					let state = get_latest_state()
					return selectors.get_oldest_pending_non_flow_engagement(state)
				},
				get_achievements_snapshot(): Readonly<AchievementSnapshot>[] {
					let state = get_latest_state()
					return selectors.get_achievements_snapshot(state)
				}
			},

			model: {
				get_state: get_latest_state,

				reset_state() {
					let state = state_fns.create()
					state = state_fns.reseed(state)
					persist_state(state)
					logger.verbose('Savegame reseted:', {state})
					emitter.emit('state_change')
				},
			},

			subscribe(fn: () => void): () => void {
				const unbind = emitter.on('state_change', fn)
				return unbind
			},

			view: {
				// allow managing a transient state
				set_state(fn: (state: T) => Partial<T>): void {
					const changed = fn(view_state)
					view_state = {
						...deep_merge(view_state, changed, {
							arrayMerge: overwriteMerge,
						})
					}
					emitter.emit('state_change')
				},

				get_state(): T {
					return view_state
				},
			}
		}
	})
}

export {
	CreateParams,
	create_game_instance,
}
