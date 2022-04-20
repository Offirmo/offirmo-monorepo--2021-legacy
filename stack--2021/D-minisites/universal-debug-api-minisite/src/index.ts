import {
	getLogger,
	overrideHook,
	exposeInternal,
	addDebugCommand,
} from '@offirmo/universal-debug-api-placeholder'


import {
	demo_logger_basic_usage,
	demo_logger_levels,
	demo_error,
	demo_group,
	demo_logger_api,

	demo_incorrect_logger_invocations,
	demo_legacy_console,
	demo_devtools_fonts,
} from '@offirmo/practical-logger-core/doc/shared-demo'

//demo_legacy_console()

const logger = getLogger({
	suggestedLevel: 'warn',
})
logger.log('hello from logger!')

const demoLogger = getLogger({
	name: 'Demo',
	suggestedLevel: 'silly',
})
demoLogger.log('hello from demoLogger!', { bar: 42, baz: 33 })

const state = {
	target: undefined as undefined | 'browser' | 'node' | 'module',
	last_demo_launched: null as null | string,
}

const target_envs = [
	'browser',
	'node',
	'module'
]

const demos = {
	'all-levels': (l) => { demo_legacy_console(); demo_logger_levels(l) },
	'basic': (l) => demo_logger_basic_usage(l, false),
	'error': (l) => demo_error(l, false),
	'groups': demo_group,
]

function run_demo(demo_id: string) {
	demos[demo_id](demoLogger)
	state.last_demo_launched = demo_id
}

function render() {
	Object.keys(demos).forEach(demo_id => {
		document.getElementById(`demo-${demo_id}`).removeAttribute('open')
	})
	if (state.last_demo_launched) {
		document.getElementById(`demo-${state.last_demo_launched}`).setAttribute("open", "true")
	}

	target_envs.forEach(demo_id => {
	})
}
render()

/// event delegation
document.addEventListener('click', event => {
	resolution: {
		try {
			const { target: clickedElement } = event
			if (!clickedElement)
				throw new Error('click event has no target!')

			let demo_id = Object.keys(demos).find(id => clickedElement.matches(`#btn-demo-${id}`))
			if (demo_id) {
				run_demo(demo_id)
				break resolution
			}

			logger.trace('Event delegation: unknown click target:', { clickedElement })
		} catch (err) {
			logger.error('processingClick', { err })
		}
	}

	render()
})
