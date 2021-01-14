const { ALL_LOG_LEVELS } = require('..')

function demo_legacy_console() {
	console.log('------------↓ For comparison: Legacy console: levels, in order ↓-----------')
	console.debug('Legacy console > message with level "debug"', { level: 'debug', foo: 42 })
	console.log('Legacy console > message with level "log"', { level: 'log', foo: 42 })
	console.info('Legacy console > message with level "info"', { level: 'info', foo: 42 })
	console.warn('Legacy console > message with level "warn"', { level: 'warn', foo: 42 })
	console.error('Legacy console > message with level "error"', { level: 'error', foo: 42 })
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

	logger.log('Test of a very very long message: "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available."')

	logger.trace('Test of a very very long data:', {
		'What is Lorem Ipsum?':
			`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
		'Why do we use it?':
			`It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).`,
		'Where does it come from?':
			`Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.`,
	})

	if (in_group) console.groupEnd()
}

function demo_logger_levels(logger) {
	console.log('------------↓ Practical logger demo: all levels, in order ↓------------')
	;[...ALL_LOG_LEVELS].reverse().forEach(level =>
		logger[level](`message with level "${level}"`, { level, foo: 42 }),
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
				console.assert(true)
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

		logger.groupCollapsed('level 2e (collapsed)')
			logger.log('in level 2e')
			console.assert(false, 'foo')
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
		name: 'LibSharedDemo',
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
			const err = new Error('Test error!')
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
	].forEach(font => console.log(`%c${font}: ABCdefi012 %cABCdefi012`, `font-family: ${font};`, 'font-family: unset;'))
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
