// beware of multiplicity!
// https://www.stucox.com/blog/the-good-and-bad-of-level-4-media-queries/#multiplicity

import {
	get_usage_observations,
	has_seen_tab_key_usage,
	has_seen_touch_usage,
} from './event-listeners'

/////////////////////

function _get_relevant_media_queries() {
	const result = {}

	// https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries
	;[
		// https://developer.mozilla.org/en-US/docs/Web/CSS/@media/any-hover
		'(any-hover: none)',
		'(any-hover: hover)',
		// https://developer.mozilla.org/en-US/docs/Web/CSS/@media/any-pointer
		'(any-pointer: none)',
		//'(any-pointer: coarse)',
		'(any-pointer: fine)',
		// https://developer.mozilla.org/en-US/docs/Web/CSS/@media/orientation
		//'(orientation: portrait)',
		//'(orientation: landscape)',
	].forEach(mq => {
		result[mq] = window.matchMedia(mq).matches
	})

	return result
}
const relevant_media_queries = _get_relevant_media_queries()

///////

// https://developer.mozilla.org/en-US/docs/Web/CSS/@media/any-hover
// https://www.stucox.com/blog/you-cant-detect-a-touchscreen/
function has_any_hover() {
	// from more trustable to less trustable:

	// if a MQ is true, it should be reliable
	if (relevant_media_queries['(any-hover: hover)']) {
		return true
	}
	if (relevant_media_queries['(any-hover: none)'])
		return false

	if (relevant_media_queries['(any-pointer: fine)']) {
		// assume the user has a mouse, so can hover
		return true
	}
	if (relevant_media_queries['(any-pointer: none)']) {
		// assume the user has no mouse
		return false
	}

	if ('ontouchstart' in window || has_seen_touch_usage) {
		// assume touchscreen = no pointer = no hover
		return false
	}

	return undefined
}

/*
// https://www.stucox.com/blog/you-cant-detect-a-touchscreen/
function has_any_touch(window = window) {
	const from_MQ = window.matchMedia('(any-hover: hover)')
	const from_
}

// https://www.stucox.com/blog/you-cant-detect-a-touchscreen/
function has_any_pointer(window = window) {
	const from_MQ = window.matchMedia('(any-hover: hover)')
	const from_
}
*/

function uses_tab() {
	return has_seen_tab_key_usage
}

/////////////////////

function get_debug_snapshot() {
	return {
		relevant_media_queries,
		usages: get_usage_observations(),
		has_any_hover: has_any_hover(),
		uses_tab: uses_tab(),
	}
}

/////////////////////

export {
	has_any_hover,
	uses_tab,

	get_debug_snapshot,
}
