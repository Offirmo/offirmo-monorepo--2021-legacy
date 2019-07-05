import EventEmitter from 'emittery'
import assert from 'tiny-invariant'

import { query_active_tab } from './utils'
import { Tab, Port } from '../common/types'
import * as State from './state'

////////////////////////////////////

let state: State.State = State.create()
console.log('🌀 initial state', state)

export const icon_emitter = new EventEmitter()
export const ui_emitter = new EventEmitter()
export const cscript_emitter = new EventEmitter()

////////////////////////////////////

export function get(): Readonly<State.State> {
	return state
}

export function get_tab_origin(tab_id: number) {
	return state.tabs[tab_id].origin
}

/*
export function get_active_origin_state({should_assert = true} = {}) {
	const current_tab_id = state.active_tab_id
	if (current_tab_id < 0 && !should_assert) return
	assert(current_tab_id >= 0, 'get_active_origin_state: current_tab_id')

	const current_tab_origin = get_tab_origin(current_tab_id)
	if (!current_tab_origin && !should_assert) return
	assert(current_tab_origin, 'get_active_origin_state: current_tab_origin')

	return state.origins[current_tab_origin]
}

export function is_current_tab_injected() {
	const current_tab_id = state.active_tab_id
	assert(current_tab_id >= 0, 'is_current_tab_injected: current_tab_id')

	return state.is_tab_injected[current_tab_id]
}

export function get_port(channel_id) {
	return state.ports[channel_id]
}
*/

////////////////////////////////////

export function on_init(): void {
	console.group('🌀 on_init')
	console.log('before', state)

	// Convenience for extension install and dev reload,
	// manual query to properly get info for the current tab
	// for whom we missed the creation events.
	// Subsequent new tabs / tab change
	// will be detected and handled normally.
	query_active_tab().then(tab => {
		console.group('🌀 on_init (2)', tab)
		on_tab_activated(tab.id!, tab)
		console.groupEnd()
	})

	console.log('after', state)
	console.groupEnd()
}

// we need to track the currently active tab
export function on_tab_activated(id: number, tab_hint?: Readonly<Tab>): void {
	console.group('🌀 on_tab_activated', {id, tab_hint})
	console.log('before', state)

	state = State.on_tab_activated(state, id, tab_hint)

	// get the origin as soon as possible
	state.active_tab.then(tab => {
		const { id: active_tab_id, url } = tab
		if (active_tab_id !== id) {
			// outdated
			console.groupCollapsed('🌀 on_tab_activated (2a): outdated tab info received, ignoring.', {active_tab_id, id})
			return
		}

		console.group('🌀 on_tab_activated (2b): updating origin', {active_tab_id, url})
		update_tab_origin(id, url)
		console.groupEnd()
	})

	icon_emitter.emit('change', state)

	console.log('after', state)
	console.groupEnd()
}

// we need to track tab origins
export function update_tab_origin(tab_id: number, url?: string): void {
	console.group('🌀 update_tab_origin', {tabId: tab_id, url})
	console.log('before', state)

	const old_state = state
	state = State.update_tab_origin(state, tab_id, url)

	if (old_state !== state) {
		icon_emitter.emit('change', state)
		ui_emitter.emit('change', state)
	}

	console.log('after', state)
	console.groupEnd()
}

// we need to store and share ports for sharing across files
export function update_port(channel_id: string, port: Readonly<Port> | null): void {
	console.group('🌀 update_port', { channel_id, port })
	console.log('before', state)

	state = State.update_port(state, channel_id, port)

	if (port) {
		port.onDisconnect.addListener(() => update_port(channel_id, null))

		if (channel_id === 'popup' || channel_id === 'devtools')
			ui_emitter.emit('change', state)
	}

	console.log('after', state)
	console.groupEnd()
}

// we need to track tab origins and overall state (injected?)
export function on_tab_loading(tab_id: number): void {
	console.group('🌀 on_tab_loading', {tab_id})
	console.log('before', state)

	state = State.on_tab_loading(state, tab_id)

	if (state.active_tab_id === tab_id)
		icon_emitter.emit('change', state)

	console.log('after', state)
	console.groupEnd()
}

// the content script reports that it injected the lib
export function report_lib_injection(tab_id: number, is_injected: boolean): void {
	console.log('🌀 report_lib_injection', {tab_id})
	console.log('before', state)

	state = State.report_lib_injection(state, tab_id, is_injected)

	if (state.active_tab_id === tab_id)
		icon_emitter.emit('change', state)

	console.log('after', state)
	console.groupEnd()
}

// user toggled it (for current tab)
export function toggle_lib_injection(): void {
	console.group('🌀 toggle_lib_injection')
	console.log('before', state)

	state = State.toggle_lib_injection(state)

	ui_emitter.emit('change', state)
	cscript_emitter.emit('change', state)

	console.log('after', state)
	console.groupEnd()
}

/*
export function on_lib_activity(tab_id) {

	ui_emitter.emit('change', state)

	console.log('after', state)
	console.groupEnd()
}

export function update_override(override_id, partial) {
	const current_tab_id = state.active_tab_id
	assert(current_tab_id >= 0, 'update_override: current_tab_id')
	const current_tab_origin = state.tab_origin[current_tab_id]
	assert(current_tab_origin, 'update_override: current_tab_origin')

	state.origins[current_tab_origin].overrides[override_id] = {
		...state.origins[current_tab_origin].overrides[override_id],
		...partial,
	}

	ui_emitter.emit('change', state)
	cscript_emitter.emit('change', state)

	console.log('after', state)
	console.groupEnd()
}

export function edit_override(override_id, value) {

	ui_emitter.emit('change', state)
	cscript_emitter.emit('change', state)

	console.log('after', state)
	console.groupEnd()
}
*/
////////////////////////////////////
