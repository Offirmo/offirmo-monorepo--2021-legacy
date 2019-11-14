
const { options } = game_frame

const logger = getLogger({
	name: LIB,
	suggestedLevel: 'warn',
})
logger.log('Starting the game frame...', options)


function open_url(url: string) {

}


const state = {
	options,
}

function render() {
	logger.trace('Render…', state)

	if (state.options.bugReportUrl) {
		document.querySelector('.loader > .timeout').style.display = 'block'
	}
}
render()

/// event delegation
document.addEventListener('click', event => {
	let shouldRender = false

	resolution: {
		try {
			const { target: clickedElement } = event

			/*
			let demo_id = Object.keys(demos).find(id => clickedElement.matches(`#btn-demo-${id}`))
			if (demo_id) {
				run_demo(demo_id)
				break resolution
			}*/

			logger.trace('Event delegation: unknown click target:', { clickedElement })
		} catch (err) {
			logger.error('Error while processing click:', { err })
		}
	}

	shouldRender && render()
})

// TODO auto loading progress
// TODO GA
// TODO
