import {
	demo_legacy_console,
	demo_logger_api,
	demo_devtools_fonts,
	demo_error,
} from '../../../2-foundation/practical-logger-core/doc/shared-demo'


export function demo_UDAPI({ exposeInternal, overrideHook, addDebugCommand }) {
	addDebugCommand('demo_logger', demo_logger_api)

	exposeInternal('foo.bar.baz', 42)

	console.log('some value =', overrideHook('some-value', 'some default'))

	console.log('API =', { ...window._debug.v1 })
}

export function demo_full(api) {
	demo_legacy_console()

	demo_logger_api(api.getLogger)
	demo_error(api.getLogger())

	demo_UDAPI(api)

	//demo_devtools_fonts()
}
