import assert from 'tiny-invariant'
import { Tabs, Runtime } from 'webextension-polyfill-ts'
import { Immutable } from '@offirmo-private/ts-types'

import { UNKNOWN_ORIGIN } from '../common/consts'
import * as OriginState from '../common/state/origin'
import * as TabState from '../common/state/tab'
import { Report } from '../common/messages'
import { get_origin, query_active_tab } from './utils'

////////////////////////////////////

export interface State {
	ports: { [channel_id: string]: Readonly<Runtime.Port> },

	active_tab_id: undefined | number,
	active_tab: Promise<Readonly<Tabs.Tab>>,

	origins: {
		[origin: string]: OriginState.State,
	}

	tabs: {
		[id: number]: TabState.State,
	}
}

////////////////////////////////////

export function get_active_tab_id(state: Readonly<State>, from: string): number {
	const { active_tab_id } = state
	assert(active_tab_id !== undefined, `get_active_tab_id() from "${from}"`)
	return active_tab_id!
}

export function get_tab_origin(state: Readonly<State>, tab_id: number): string {
	const tab_state: TabState.State = state.tabs[tab_id]
	assert(!!tab_state, 'get_tab_origin tab state')
	return tab_state.origin
}

export function get_active_origin_state(state: Readonly<State>, {should_assert = true} = {}): OriginState.State {
	const active_tab_id = get_active_tab_id(state, 'get_active_origin_state()')
	const current_tab_origin = get_tab_origin(state, active_tab_id)
	assert(!!current_tab_origin, 'get_active_origin_state(): current_tab_origin')

	return state.origins[current_tab_origin]
}

export function get_active_tab_state(state: Readonly<State>): TabState.State {
	const active_tab_id = get_active_tab_id(state, 'get_active_tab_state()')

	return state.tabs[active_tab_id]
}

export function get_port(state: Readonly<State>, channel_id: string): Readonly<Runtime.Port> | undefined {
	return state.ports[channel_id]
}

////////////////////////////////////

export function create(): Readonly<State> {
	return {
		ports: {},

		active_tab_id: undefined,
		active_tab: new Promise(() => {}),

		origins: {
			[UNKNOWN_ORIGIN]: OriginState.create(UNKNOWN_ORIGIN),
			//[LOCAL_DEMO_ORIGIN]: OriginState.create_demo(LOCAL_DEMO_ORIGIN),
		},

		tabs: {},
	}
}

// we need to store and share ports for sharing across files
export function update_port(state: Readonly<State>, channel_id: string, port: Readonly<Runtime.Port> | null): Readonly<State> {
	if (port)
		state.ports[channel_id] = port
	else
		delete state.ports[channel_id]

	return state
}

// tab lifecycle events happen in any order
export function ensure_tab(state: Readonly<State>, source: string, id: number): Readonly<State> {
	if (state.tabs[id]) return state

	console.log(`✅ Tab #${id} discovered through ${source}`)
	return {
		...state,
		tabs: {
			...state.tabs,
			[id]: TabState.create(id),
		},
	}
}

// we need to track the currently active tab,
// mainly to update the extension icon
export function on_tab_activated(state: Readonly<State>, id: number, tab_hint?: Readonly<Tabs.Tab>): Readonly<State> {
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
// UNKNOWN_ORIGIN is for non-browsing tabs, ex. browser settings, which have no URL
export function update_tab_origin(state: Readonly<State>, tab_id: number, url: string = UNKNOWN_ORIGIN): Readonly<State> {
	if (state.tabs[tab_id].url === url) return state // up to date

	const origin = get_origin(url)

	state = {
		...state,
		origins: {
			...state.origins,
			[origin]: state.origins[origin] || OriginState.create(origin),
		},
	}

	state = {
		...state,
		tabs: {
			...state.tabs,
			[tab_id]: TabState.update_origin(state.tabs[tab_id], url, state.origins[origin]),
		},
	}

	return state
}

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
	const { origin } = state.tabs[tab_id]
	return {
		...state,
		origins: {
			...state.origins,
			[origin]: OriginState.report_lib_injection(state.origins[origin], is_injected),
		},
		tabs: {
			...state.tabs,
			[tab_id]: TabState.report_lib_injection(state.tabs[tab_id], is_injected),
		},
	}
}

export function toggle_lib_injection(state: Readonly<State>, tab_id: number): Readonly<State> {
	assert(tab_id >= 0, 'toggle_lib_injection: tab_id')
	const tab_origin = state.tabs[tab_id].origin
	assert(!!tab_origin, 'toggle_lib_injection: tab_origin')

	return {
		...state,
		origins: {
			...state.origins,
			[tab_origin]: OriginState.toggle_lib_injection(state.origins[tab_origin]),
		},
	}
}

export function report_debug_api_usage(state: Readonly<State>, tab_id: number, reports: Report[]): Readonly<State> {
	let tab_state = state.tabs[tab_id]
	assert(!!tab_state, 'report_debug_api_usage: tab_state')
	let origin_state = state.origins[tab_state.origin]
	assert(!!origin_state, 'report_debug_api_usage: origin_state')

	reports.forEach((report: Report) => {
		origin_state = OriginState.report_debug_api_usage(origin_state, report)
		tab_state = TabState.report_debug_api_usage(tab_state, report)
	})

	return {
		...state,
		origins: {
			...state.origins,
			[tab_state.origin]: origin_state,
		},
		tabs: {
			...state.tabs,
			[tab_id]: tab_state,
		},
	}
}

export function change_override_spec(state: Readonly<State>, tab_id: number, key: string, partial: Readonly<Partial<OriginState.OverrideState>>): Readonly<State> {
	assert(tab_id >= 0, 'change_override_spec: tab_id')
	const tab_origin = state.tabs[tab_id].origin
	assert(!!tab_origin, 'change_override_spec: tab_origin')

	return {
		...state,
		origins: {
			...state.origins,
			[tab_origin]: OriginState.change_override_spec(state.origins[tab_origin], key, partial),
		},
	}
}

////////////////////////////////////
