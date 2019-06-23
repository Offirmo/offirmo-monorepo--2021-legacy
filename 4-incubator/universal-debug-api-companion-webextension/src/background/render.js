import {
	get as get_state,
	icon_emitter,
	ui_emitter,
	cscript_emitter,
} from './state'

////////////////////////////////////

function render_webext_icon(state) {
	console.log('🔄 render_webext_icon')
	const current_tab_id = state.active_tab_id

	// Note: it sets it for ALL tabs

	if (state.is_tab_injected[current_tab_id]) {
		chrome.browserAction.setBadgeText({ text: '✔' })
		chrome.browserAction.setBadgeBackgroundColor({ color: "#00AA00"})
	}
	else {
		chrome.browserAction.setBadgeText({ text: '' })
		chrome.browserAction.setBadgeBackgroundColor({ color: "#aaaaaa"})
	}
}
render_webext_icon(get_state())

icon_emitter.on('change', () => {
	render_webext_icon(get_state())
})

////////////////////////////////////


////////////////////////////////////


////////////////////////////////////
