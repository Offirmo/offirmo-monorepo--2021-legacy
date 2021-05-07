import EventEmitter from 'emittery'
import assert from 'tiny-invariant'
import { Tabs, Runtime } from 'webextension-polyfill-ts'
import { Immutable } from '@offirmo-private/ts-types'

import * as OriginState from '../common/state/origin'
import * as TabState from '../common/state/tab'
import * as UIState from '../common/state/ui'
import { Report } from '../common/messages'
import { query_active_tab } from './utils'
import * as State from './state'

////////////////////////////////////

let state: State.State = State.create()
console.log('🌀 initial state', state)

export const icon_emitter = new EventEmitter()
export const ui_emitter = new EventEmitter()
export const cscript_emitter = new EventEmitter()

////////////////////////////////////

export function get_active_tab_id(from: string): number {
	return State.get_active_tab_id(state, from)
}

export function get_port(channel_id: string): ReturnType<typeof State.get_port> {
	return State.get_port(state, channel_id)
}

export function get_tab_origin(tab_id: number) {
	return state.tabs[tab_id].origin
}

export function get_active_tab_sync_status(): TabState.SpecSyncStatus {
	assert(get_active_tab_id('get_active_tab_sync_status()') !== undefined)
	const t = State.get_active_tab_state(state)
	const o = State.get_active_origin_state(state)

	return TabState.get_sync_status(t, o)
}

export function get_active_origin_state() {
	const current_tab_id = get_active_tab_id('get_active_origin_state()')

	const current_tab_origin = get_tab_origin(current_tab_id)
	assert(current_tab_origin, 'get_active_origin_state: current_tab_origin')

	return state.origins[current_tab_origin]
}

export function get_active_tab_ui_state(): UIState.State {
	assert(get_active_tab_id('get_active_tab_ui_state()') !== undefined)
	const tab = State.get_active_tab_state(state)
	const origin = State.get_active_origin_state(state)
	return {
		tab,
		origin,
	}
}

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

export function ensure_tab(source: string, id: number, tab_hint?: Readonly<Tabs.Tab>): void {
	console.group('🌀 ensure_tab', {id, tab_hint})
	if (state.tabs[id]) {
		console.log('(no change)')
	}
	else {
		console.log('before', state)

		state = State.ensure_tab(state, source, id)

		// no react, we should get tab events soon

		console.log('after', state)
	}

	console.groupEnd()
}

export function on_tab_activated(id: number, tab_hint?: Readonly<Tabs.Tab>): void {
	console.group('🌀 on_tab_activated', {id, tab_hint})

	if (state.active_tab_id === id) {
		console.log('(no change)')
	}
	else {
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
			if (url)
				update_tab_origin(id, url)
			console.groupEnd()
		})

		icon_emitter.emit('change', state)
		ui_emitter.emit('change', state) // for the popup to self-close in some cases

		console.log('after', state)
	}

	console.groupEnd()
}

export function update_tab_origin(tab_id: number, url: string): void {
	console.group('🌀 update_tab_origin', {tabId: tab_id, url})
	console.log('before', state)

	const old_state = state
	state = State.update_tab_origin(state, tab_id, url)

	if (old_state !== state && state.active_tab_id !== undefined) {
		icon_emitter.emit('change', state)
		ui_emitter.emit('change', state)
	}

	console.log('after', state)
	console.groupEnd()
}

export function update_port(channel_id: string, port: Readonly<Runtime.Port> | null): void {
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

export function on_tab_loading(tab_id: number): void {
	console.group('🌀 on_tab_loading', {tab_id})
	console.log('before', state)

	state = State.on_tab_loading(state, tab_id)

	if (state.active_tab_id === tab_id)
		icon_emitter.emit('change', state)

	console.log('after', state)
	console.groupEnd()
}

export function report_lib_injection(tab_id: number, is_injected: boolean): void {
	console.group('🌀 report_lib_injection', {tab_id, is_injected, known_active_tab: state.active_tab_id})
	console.log('before', state)

	state = State.report_lib_injection(state, tab_id, is_injected)

	if (state.active_tab_id === tab_id) {
		icon_emitter.emit('change', state)
		ui_emitter.emit('change', state)
	}

	console.log('after', state)
	console.groupEnd()
}

export function toggle_lib_injection(tab_id: number): void {
	console.group('🌀 toggle_lib_injection')
	console.log('before', state)

	state = State.toggle_lib_injection(state, tab_id)

	icon_emitter.emit('change', state)
	ui_emitter.emit('change', state)
	cscript_emitter.emit('change', state)

	console.log('after', state)
	console.groupEnd()
}

export function report_debug_api_usage(tab_id: number, reports: Report[]): void {
	console.group('🌀 report_debug_api_usage', { reports })
	console.log('before', state)

	state = State.report_debug_api_usage(state, tab_id, reports)

	if (state.active_tab_id === tab_id) {
		icon_emitter.emit('change', state)
		ui_emitter.emit('change', state)
	}

	console.log('after', state)
	console.groupEnd()
}

export function change_override_spec(tab_id: number, key: string, partial: Readonly<Partial<OriginState.OverrideState>>) {
	console.group('🌀 change_override_spec', { tab_id, key, partial })
	console.log('before', state)

	state = State.change_override_spec(state, tab_id, key, partial)

	icon_emitter.emit('change', state)
	ui_emitter.emit('change', state)
	cscript_emitter.emit('change', state)

	console.log('after', state)
	console.groupEnd()
}

////////////////////////////////////

// convenience
export { State } from './state'
