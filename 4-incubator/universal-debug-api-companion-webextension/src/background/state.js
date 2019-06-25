import EventEmitter from 'emittery'
import assert from 'tiny-invariant'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'

import { create_default_origin_state, create_demo_origin_state } from '../common/origin-state'

export const icon_emitter = new EventEmitter()
export const ui_emitter = new EventEmitter()
export const cscript_emitter = new EventEmitter()

////////////////////////////////////

const state = {
	ports: {},

	active_tab_id: -1,
	active_tab: get_active_tab(),
	is_tab_injected: {},

	tab_url: {},
	tab_origin: {},

	origins: {
		"???": create_default_origin_state({is_eligible: false}),
		"http://localhost:1234": create_demo_origin_state(),
	}
}
console.log('🌀 initial state', state)

export function get() {
	return state
}

export function get_active_origin_state({should_assert = true} = {}) {
	const current_tab_id = state.active_tab_id
	if (current_tab_id < 0 && !should_assert) return
	assert(current_tab_id >= 0, 'get_active_origin_state: current_tab_id')

	const current_tab_origin = state.tab_origin[current_tab_id]
	if (!current_tab_origin && !should_assert) return
	assert(current_tab_origin, 'get_active_origin_state: current_tab_origin')

	return state.origins[current_tab_origin]
}

function get_active_tab() {
	return new Promise(resolve => {
		chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
			resolve(tabs[0])
		});
	})
}

export function get_port(channel_id) {
	return state.ports[channel_id]
}

////////////////////////////////////

export function update_port(channel_id, port) {
	console.log('🌀 update_port', { channel_id, port }, state)

	state.ports[channel_id] = port

	if (port) {
		port.onDisconnect.addListener(() => update_port(channel_id, null))

		if (channel_id === 'popup' || channel_id === 'devtools')
			ui_emitter.emit('change', state)
	}
}

// convenience for extension install and dev reload,
// to properly get info for the current tab.
// subsequent new tabs / tab change
// are detected and handled separately
export function on_init() {
	console.log('🌀 on_init', state)

	get_active_tab().then(tab => {
		console.log('🌀 on_init (2)', tab)
		on_tab_activated(tab.id, tab)
	})
}

// we need to track the currently active tab,
// mainly to update the extension icon
export function on_tab_activated(id, tab_hint) {
	console.log('🌀 on_tab_activated', {id, tab_hint}, state)

	state.active_tab_id = id
	state.active_tab = tab_hint ? Promise.resolve(tab_hint) : get_active_tab()
	state.active_tab.then(tab => {
		const { id: active_tab_id, url } = tab
		if (active_tab_id !== id) {
			// outdated
			console.info('outdated tab info received, ignoring.', {active_tab_id, id})
			return
		}

		update_tab_origin(id, url)
	})

	icon_emitter.emit('change', state)
}

// we need to track tab origins
// to properly apply the settings for this origin
// ??? is for non-browsing tabs, ex. settings, which have no URL
export function update_tab_origin(tabId, url = '???') {
	console.log('🌀 update_tab_origin', {tabId, url}, state)
	if (state.tab_url[tabId] === url) return // up to date

	const origin = url === '???' ? '???' : (new URL(url)).origin

	state.tab_url[tabId] = url
	state.tab_origin[tabId] = origin
	state.origins[origin] = {
		...state.origins[origin],
		last_active: get_UTC_timestamp_ms(),
	}

	icon_emitter.emit('change', state)
	ui_emitter.emit('change', state)
}

// if a tab gets created, or a navigation happens inside a tab,
// we may change domain and the lib may no longer be injected.
export function question_lib_injection(tab_id) {
	console.log('🌀 question_lib_injection', {tab_id}, state)

	state.is_tab_injected[tab_id] = false // until further notice
	if (state.active_tab_id === tab_id)
		icon_emitter.emit('change', state)
}

// the content script reports that it injected the lib
export function on_lib_injected(tab_id) {
	console.log('🌀 on_lib_injected', {tab_id}, state)

	state.is_tab_injected[tab_id] = true
	if (state.active_tab_id === tab_id)
		icon_emitter.emit('change', state)
}

// user toggled it (for current tab)
export function toggle_lib_injection() {
	console.log('🌀 toggle_lib_injection', state)

	const current_tab_id = state.active_tab_id
	assert(current_tab_id >= 0, 'toggle_lib_injection: current_tab_id')
	const current_tab_origin = state.tab_origin[current_tab_id]
	assert(current_tab_origin, 'toggle_lib_injection: current_tab_origin')

	state.origins[current_tab_origin] = {
		...state.origins[current_tab_origin],
		is_injection_enabled: !state.origins[current_tab_origin].is_injection_enabled,
		last_active: get_UTC_timestamp_ms(),
	}

	ui_emitter.emit('change', state)
	cscript_emitter.emit('change', state)
}

export function on_lib_activity(tab_id) {

	ui_emitter.emit('change', state)
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
}

export function edit_override(override_id, value) {

	ui_emitter.emit('change', state)
	cscript_emitter.emit('change', state)
}

////////////////////////////////////
