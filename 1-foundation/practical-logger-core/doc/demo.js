const { createLogger } = require('..')

const {
	demo_standard_console,
	demo_logger_basic_usage,
	demo_logger_levels,
	demo_group,
	demo_incorrect_logger_invocations,
	demo_logger_api,
	demo_devtools_fonts,
} = require('./shared-demo')

const logger = createLogger({
	name: 'demo',
	suggestedLevel: 'silly',
})

demo_standard_console()
//demo_logger_api(createLogger)

//demo_logger_basic_usage(logger)
//demo_logger_levels(logger)
demo_group(logger)
//demo_incorrect_logger_invocations(logger)
//demo_devtools_fonts(logger)
