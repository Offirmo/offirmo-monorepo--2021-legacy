import EventEmitter from 'emittery'

export const icon_emitter = new EventEmitter()
export const ui_emitter = new EventEmitter()
export const cscript_emitter = new EventEmitter()

////////////////////////////////////

const state = {
	active_tab_id: -1,
	active_tab: get_active_tab(),
	is_tab_injected: {},

	persisted: {

	}
}

export function get() {
	return state
}

////////////////////////////////////

export function on_tab_activated(id) {
	console.log('🌀 on_tab_activated', {id}, state)

	state.active_tab_id = id
	state.active_tab = get_active_tab()

	icon_emitter.emit('change', state)
}

export function question_lib_injection(tab_id) {
	console.log('🌀 question_lib_injection', {tab_id}, state)

	state.is_tab_injected[tab_id] = false // until further notice
	if (state.active_tab_id === tab_id)
		icon_emitter.emit('change', state)
}

export function on_lib_injected(tab_id) {
	console.log('🌀 on_lib_injected', {tab_id}, state)

	state.is_tab_injected[tab_id] = true
	if (state.active_tab_id === tab_id)
		icon_emitter.emit('change', state)
}

export function on_lib_activity(id) {

}

export function toggle_override(id) {

}

export function toggle_lib_injection(id) {

}

////////////////////////////////////

function get_active_tab() {
	return new Promise(resolve => {
		chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
			resolve(tabs[0])
		});
	})
}

////////////////////////////////////
