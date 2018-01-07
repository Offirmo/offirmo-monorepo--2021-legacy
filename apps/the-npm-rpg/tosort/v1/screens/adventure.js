const { wrapLines, stylizeString } = require('../deps')

const { render_adventure } = require('@oh-my-rpg/view-text')

/////////////////////////////////////////////////



function render({term_width, config, rendering_options}) {
	const state = config.store

	if (!state.last_adventure) {
		console.log('[select play to go on an adventure]')
	}
	else {
		console.log(`Episode #${state.good_click_count}\n`)
		console.log(
			wrapLines(term_width)(
				stylizeString.bold(render_adventure(state.last_adventure, rendering_options))
			)
		)
	}
}

/////////////////////////////////////////////////

module.exports = {
	render,
}
