import assert from 'tiny-invariant'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'

import { UNKNOWN_ORIGIN } from '../common/consts'
import * as OriginState from '../common/state/origin'
import * as TabState from '../common/state/tab'
import { Tab, Port } from '../common/types'
import { query_active_tab } from './utils'

////////////////////////////////////

export interface State {
	ports: { [channel_id: string]: Readonly<Port> },

	active_tab_id: number,
	active_tab: Promise<Readonly<Tab>>,

	origins: {
		[origin: string]: OriginState.State,
	}

	tabs: {
		[id: number]: TabState.State,
	}
}

////////////////////////////////////

export const LOCAL_DEMO_ORIGIN = 'http://localhost:1234'

////////////////////////////////////

export function get_tab_origin(state: Readonly<State>, tab_id: number): string {
	const tab_state: TabState.State = state.tabs[tab_id]
	assert(!!tab_state, 'get_tab_origin tab state')
	return tab_state.origin
}

export function get_active_origin_state(state: Readonly<State>, {should_assert = true} = {}): OriginState.State {
	const { active_tab_id } = state
	assert(active_tab_id >= 0, 'get_active_origin_state: active_tab_id')

	const current_tab_origin = get_tab_origin(state, active_tab_id)
	assert(!!current_tab_origin, 'get_active_origin_state: current_tab_origin')

	return state.origins[current_tab_origin]
}

export function get_active_tab_state(state: Readonly<State>): TabState.State {
	const { active_tab_id } = state
	assert(active_tab_id >= 0, 'get_active_tab_state: active_tab_id')

	return state.tabs[active_tab_id]
}

/*
export function is_current_tab_injected() {
	const current_tab_id = state.active_tab_id
	assert(current_tab_id >= 0, 'is_current_tab_injected: current_tab_id')

	return state.is_tab_injected[current_tab_id]
}
*/

export function get_port(state: Readonly<State>, channel_id: string): Readonly<Port> {
	assert(state.ports[channel_id], `port "${channel_id}"`)
	return state.ports[channel_id]
}

////////////////////////////////////

export function create(): Readonly<State> {
	return {
		ports: {},

		active_tab_id: -1,
		active_tab: new Promise(() => {}),

		origins: {
			[UNKNOWN_ORIGIN]: OriginState.create(UNKNOWN_ORIGIN),
			[LOCAL_DEMO_ORIGIN]: OriginState.create_demo(LOCAL_DEMO_ORIGIN),
		},

		tabs: {},
	}
}

export function update_port(state: Readonly<State>, channel_id: string, port: Readonly<Port> | null): Readonly<State> {
	if (port)
		state.ports[channel_id] = port
	else
		delete state.ports[channel_id]

	return state
}

// we need to track the currently active tab,
// mainly to update the extension icon
export function on_tab_activated(state: Readonly<State>, id: number, tab_hint?: Readonly<Tab>): Readonly<State> {
	return {
		...state,
		active_tab_id: id,
		active_tab: tab_hint ? Promise.resolve(tab_hint) : query_active_tab(),
		tabs: {
			...state.tabs,
			[id]: state.tabs[id] || TabState.create(id),
		},
	}
}

// we need to track tab origins
// to properly apply the settings for this origin
// ??? is for non-browsing tabs, ex. settings, which have no URL
export function update_tab_origin(state: Readonly<State>, tab_id: number, url: string = UNKNOWN_ORIGIN): Readonly<State> {
	if (state.tabs[tab_id].url === url) return state // up to date

	state = {
		...state,
		tabs: {
			...state.tabs,
			[tab_id]: TabState.update_origin(state.tabs[tab_id], url),
		},
	}

	const { origin } = state.tabs[tab_id]

	state = {
		...state,
		origins: {
			...state.origins,
			[origin]: state.origins[origin] || OriginState.create(origin),
		},
	}

	return state
}

// if a tab gets created, or a navigation happens inside a tab,
// we may change domain and the current page state may switch to another origin
export function on_tab_loading(state: Readonly<State>, tab_id: number): Readonly<State> {
	return {
		...state,
		tabs: {
			...state.tabs,
			[tab_id]: TabState.on_load(state.tabs[tab_id]),
		},
	}
}

export function report_lib_injection(state: Readonly<State>, tab_id: number, is_injected: boolean): Readonly<State> {
	return {
		...state,
		tabs: {
			...state.tabs,
			[tab_id]: TabState.report_lib_injection(state.tabs[tab_id], is_injected),
		},
	}
}

// user toggled it (for current tab)
export function toggle_lib_injection(state: Readonly<State>): Readonly<State> {
	const { active_tab_id } = state
	assert(active_tab_id >= 0, 'toggle_lib_injection: active_tab_id')
	const current_tab_origin = state.tabs[active_tab_id].origin
	assert(!!current_tab_origin, 'toggle_lib_injection: current_tab_origin')

	return {
		...state,
		origins: {
			...state.origins,
			[current_tab_origin]: OriginState.toggle_lib_injection(state.origins[current_tab_origin]),
		}
	}
}

/*
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
*/

////////////////////////////////////
