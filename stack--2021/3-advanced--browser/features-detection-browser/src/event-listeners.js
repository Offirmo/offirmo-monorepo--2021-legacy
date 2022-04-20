
/////////////////////

const DEBUG = false
const LIB = '$FDB'
if (DEBUG) console.info(`[${LIB}] Hello!`)

// https://hackernoon.com/removing-that-ugly-focus-ring-and-keeping-it-too-6c8727fefcd2
let has_seen_tab_key_usage = false // so far

// https://www.stucox.com/blog/you-cant-detect-a-touchscreen/
let has_seen_touch_usage = false // so far

// https://www.stucox.com/blog/you-cant-detect-a-touchscreen/
// tricky bc for ex. Safari iOs sends mouse event for compatibility
//let has_seen_credible_mouse_usage = false // so far

/////////////////////

function on_key_down_to_detect_tabs(evt) {
	if (evt.keyCode === 9) { // tab = the "I am a keyboard user" key
		if (DEBUG) console.info(`[${LIB}] Keyboard usage detected! (tab key)`)
		has_seen_tab_key_usage = true
		document.body.classList.add('user-is-tabbing')
		window.removeEventListener('keydown', on_key_down_to_detect_tabs)
	}
}
window.addEventListener('keydown', on_key_down_to_detect_tabs)

function on_touch_start() {
	if (DEBUG) console.info(`[${LIB}] touch detected!`)
	has_seen_touch_usage = true
	window.removeEventListener('touchstart', on_touch_start)
}
window.addEventListener('touchstart', on_touch_start)

// https://developer.mozilla.org/en-US/docs/Web/Events/pointerover
function on_pointer_over(evt) {
	if (DEBUG) console.info(`[${LIB}] pointer event`, { evt, type: evt.pointerType, pointerType: evt.pointerType })
	switch(evt.pointerType) {
		case 'touch':
			if (DEBUG) console.info(`[${LIB}] seen touch usage!`)
			has_seen_touch_usage = true
			break

		case 'pen':
			break

		case 'mouse':
			// not reliable, Safari iOs emulates mouse hover
			break

		default:
			break
	}

	window.removeEventListener('pointerover', on_pointer_over)
}
window.addEventListener('pointerover', on_pointer_over)

/////////////////////

function get_usage_observations() {
	return {
		has_seen_tab_key_usage,
		has_seen_touch_usage,
	}
}

export {
	get_usage_observations,
	has_seen_tab_key_usage,
	has_seen_touch_usage,
}

