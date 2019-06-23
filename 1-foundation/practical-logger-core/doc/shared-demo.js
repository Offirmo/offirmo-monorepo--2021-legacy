const { ALL_LOG_LEVELS } = require('..')

function demo_standard_console() {
	console.log('------------↓ demo: standard console ↓-----------')
	console.error('Standard console "error"')
	console.warn('Standard console "warn"')
	console.info('Standard console "info"')
	console.log('Standard console "log"')
	console.debug('Standard console "debug"')
}

function demo_logger_basic_usage(logger) {
	console.group('-----------↓ logger demo: basic usage ↓-----------')
	logger.verbose('Restoring state…')
	logger.warn('Restoration is taking more time than usual', { elapsedMs: 3000 })

	const bob = {
		firstName: 'Bob',
		lastName: 'Dupont',
		age: 42,
	}

	logger.verbose('Current user loaded', { user: bob })

	const err = new Error('Timeout loading state!')
	err.httpStatus = 418 // to check that custom props are preserved

	logger.error(undefined, err)
	console.groupEnd()
}

function demo_logger_levels(logger) {
	console.log('-----------↓ logger demo: all levels, in order ↓-----------')
	ALL_LOG_LEVELS.forEach(level =>
		logger[level](`demo with level "${level}"`, { level, foo: 42 })
	)

	/*
console.groupCollapsed('in group')
ALL_LOG_LEVELS.forEach(level =>
    logger[level](`msg with level "${level}"`)
)
console.groupEnd()
*/
}

function demo_group(logger) {
	console.log('-----------↓ logger demo: group ↓-----------')

	logger.group('level 1')
	logger.log('in level 1')

	logger.groupCollapsed('level 2a')
	logger.log('in level 2a')
	logger.groupEnd()

	logger.groupCollapsed('level 2b')
	logger.log('in level 2b')
	logger.error(new Error('in level 2b!'))
	logger.groupEnd()

	logger.log('where am I?')
	logger.groupEnd()
	logger.groupEnd()
	logger.groupEnd()
}

function demo_incorrect_logger_invocations(logger) {
	const bob = {
		firstName: 'Bob',
		lastName: 'Dupont',
		age: 42,
	}

	const more = 'some stuff'

	const err = new Error('Timeout loading state!')
	err.httpStatus = 418 // to check that custom props are preserved

	console.group('-----------↓ logger demo: incorrect invocation (bunyan style) ↓-----------')
	logger.info()

	logger.info('hi')
	logger.info('hi %s', bob, more)

	logger.info({foo: 'bar'}, 'hi')

	logger.info(err)
	logger.info(err, 'more on this: %s', more)

	logger.info({foo: 'bar', err: err}, 'some msg about this error')
	logger.warn('foo', 'bar', 42)
	console.groupEnd()
}

function demo_logger_api(getLogger) {
	console.log('-----------↓ logger creation and basic usage ↓-----------')
	const root_logger = getLogger({
		suggestedLevel: 'silly',
	})
	root_logger.log('Starting up')

	const logger = getLogger({
		name: 'Persistence',
		suggestedLevel: 'silly',
	})

	demo_logger_basic_usage(logger)

	demo_logger_levels(logger)

	demo_group(logger)

	demo_incorrect_logger_invocations(logger)
}

function demo_devtools_fonts() {
	console.group('-----------↓ available font styles ↓-----------')
	console.log('default: ABCdef012')

	;[
		'-apple-system',
		'BlinkMacSystemFont',
		'"avenir next"',
		'avenir',
		'"Segoe UI"',
		'"lucida grande"',
		'"helvetica neue"',
		'helvetica',
		'"Fira Sans"',
		'roboto',
		//'noto',
		//'"Droid Sans"',
		//'cantarell',
		//'oxygen',
		//'ubuntu',
		//'"franklin gothic medium"',
		//'"century gothic"',
		'"Liberation Sans"',
		'sans-serif',
		'"dejavu sans mono"',
		'"Fira Code"',
		'Menlo',
		'Consolas',
		'"Lucida Console"',
		'"Courier New"',
		'monospace',
	].forEach(font => console.log(`%c${font}: ABCdefi012 %cABCdefi012`, `font-family: ${font};`, `font-family: unset;`))
	console.groupEnd()
}

module.exports = {
	demo_standard_console,
	demo_logger_basic_usage,
	demo_logger_levels,
	demo_group,
	demo_incorrect_logger_invocations,
	demo_logger_api,
	demo_devtools_fonts,
}
