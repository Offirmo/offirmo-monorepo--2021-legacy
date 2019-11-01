const { ALL_LOG_LEVELS } = require('..')

function demo_legacy_console() {
	console.log('------------↓ For comparison: Legacy console: levels, in order ↓-----------')
	console.debug('Legacy console > message with level "debug"', { level: "debug", foo: 42 })
	console.log('Legacy console > message with level "log"', { level: "log", foo: 42 })
	console.info('Legacy console > message with level "info"', { level: "info", foo: 42 })
	console.warn('Legacy console > message with level "warn"', { level: "warn", foo: 42 })
	console.error('Legacy console > message with level "error"', { level: "error", foo: 42 })
}


function demo_logger_basic_usage(logger, in_group = true) {
	console[in_group ? 'group' : 'log']('------------↓ Practical logger demo: example real usage ↓------------')

	logger.silly('Hi!')
	logger.trace('App starting...', { version: '1.2.3' })

	const bob = {
		firstName: 'Bob',
		lastName: 'Dupont',
		age: 42,
	}

	logger.verbose('Current user already logged in', { user: bob })

	logger.verbose('Restoring state from cloud…')

	logger.warn('Restoration of state is taking more time than expected', { elapsedMs: 3000 })

	const err = new Error('Timeout loading state!')
	err.httpStatus = 418 // to check that custom props are preserved

	logger.error(undefined, err)

	logger.info('Reverting to last known local state')

	if (in_group) console.groupEnd()
}

function demo_logger_levels(logger) {
	console.log('------------↓ Practical logger demo: all levels, in order ↓------------')
	;[...ALL_LOG_LEVELS].reverse().forEach(level =>
		logger[level](`message with level "${level}"`, { level, foo: 42 })
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
	console.log('------------↓ logger demo: group ↓------------')

	logger.group('level 1 (NOT collapsed)')
		logger.log('in level 1')

		logger.groupCollapsed('level 2a (collapsed)')
			logger.log('in level 2a')
		logger.groupEnd()

		logger.groupCollapsed('level 2b (collapsed)')
			// no output
			logger.group('level 3a (NOT collapsed)')
				// no output
			logger.groupEnd()
		logger.groupEnd()

		logger.groupCollapsed('level 2c (collapsed)')
			// no output
			logger.warn('warn from level 2c!')
			logger.error(new Error('error from level 2c!'))
		logger.groupEnd()

		logger.groupCollapsed('level 2d (collapsed)')
			logger.log('in level 2d')
			logger.group('level 3b (NOT collapsed)')
				logger.warn('warn from level 3b!')
				logger.error(new Error('error from level 3b!'))
				logger.log('in level 3b')
			logger.groupEnd()
			logger.log('in level 2d')
		logger.groupEnd()

		logger.log('where am I? (should be in level 1)')
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

	console.group('------------↓ logger demo: incorrect invocation (bunyan style) ↓------------')
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
	console.log('------------↓ logger creation and basic usage ↓------------')
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

function demo_error(logger, in_group = true) {
	console[in_group ? 'group' : 'log']('------------↓ logger demo: error display ↓------------')

	function foo() {
		function bar() {
			const err = new Error('Test!')
			err.statusCode = 1234
			err.details = {
				hello: 42,
			}

			throw err
		}
		bar()
	}

	try {
		foo()
	}
	catch (err) {
		logger.log(err)
		logger.log('message', err)
		logger.log('message', { some: 'stuff', err })
		logger.error(err)
		logger.error('message', err)
		logger.error('message', { some: 'stuff', err })
		//logger.error('message', { some: 'stuff' }, err)
		//logger.error('message', err, { some: 'stuff' })
		logger.error('message', { some: 'stuff' })
	}

	if (in_group) console.groupEnd()
}

function demo_devtools_fonts() {
	console.group('------------↓ available font styles ↓------------')
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
	demo_legacy_console,
	demo_logger_basic_usage,
	demo_logger_levels,
	demo_error,
	demo_group,
	demo_incorrect_logger_invocations,
	demo_logger_api,
	demo_devtools_fonts,
}
