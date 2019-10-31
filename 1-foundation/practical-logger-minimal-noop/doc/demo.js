const { createLogger } = require('..')

const {
	demo_legacy_console,
	demo_logger_basic_usage,
	demo_logger_levels,
	demo_group,
	demo_incorrect_logger_invocations,
	demo_logger_api,
	demo_devtools_fonts,
} = require('../../practical-logger-core/doc/shared-demo')

const logger = createLogger({
	name: 'demo',
	suggestedLevel: 'silly',
})

demo_legacy_console()
demo_logger_api(createLogger)

//demo_logger_basic_usage(logger)
//demo_logger_levels(logger)
//demo_group(logger)
//demo_incorrect_logger_invocations(logger)
//demo_devtools_fonts(logger)
