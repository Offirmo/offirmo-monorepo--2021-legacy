
/////////////////////

// https://hackernoon.com/removing-that-ugly-focus-ring-and-keeping-it-too-6c8727fefcd2
let has_seen_tab_key_usage = false // so far

// http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
let has_seen_touch_usage = false // so far

// http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
let has_seen_mouse_usage = false // so far

/////////////////////

function get_usage_observations() {
	return {
		has_seen_tab_key_usage,
		has_seen_touch_usage,
		has_seen_mouse_usage,
	}
}

export {
	get_usage_observations,
	has_seen_tab_key_usage,
	has_seen_touch_usage,
	has_seen_mouse_usage,
}

/////////////////////

function on_key_down_to_detect_tabs(evt) {
	if (evt.keyCode === 9) { // the "I am a keyboard user" key
		has_seen_tab_key_usage = true
		document.body.classList.add('user-is-tabbing')
		window.removeEventListener('keydown', on_key_down_to_detect_tabs)
	}
}
window.addEventListener('keydown', on_key_down_to_detect_tabs)

///////

function on_touch_start() {
	has_seen_touch_usage = true
	window.removeEventListener('touchstart', on_touch_start)
}
window.addEventListener('touchstart', on_touch_start)

///////

// https://developer.mozilla.org/en-US/docs/Web/Events/pointerover
function on_pointer_over(evt) {
	switch(evt.pointerType) {
		case 'touch':
			has_seen_touch_usage = true
			break

		case 'pen':
			break

		case 'mouse':
			has_seen_mouse_usage = true
			break

		default:
			break
	}

	// TODO cleanup some time?
	//window.removeEventListener('pointerover', on_pointer_over)
}
window.addEventListener('pointerover', on_pointer_over)
