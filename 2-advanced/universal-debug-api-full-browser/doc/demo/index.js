const { ALL_LOG_LEVELS } = require('@offirmo/practical-logger-core')

import {
	getLogger,
	exposeInternal,
	overrideHook,
	addDebugCommand,
} from '../..'

console.log('starting...')

function demo_standard_console() {
	console.log('------------ standard console ------------')
	console.error('Standard console "error"')
	console.warn('Standard console "warn"')
	console.info('Standard console "info"')
	console.log('Standard console "log"')
	console.debug('Standard console "debug"')
}

function demo_logger_basic_usage(logger) {
	root_logger.log('hello world!')


	const err = new Error('Some Error!')
	err.httpStatus = 418 // to check that custom props are preserved

	const bob = {
		firstName: 'Bob',
		lastName: 'Dupont',
		age: 42,
	}
	const more = 'some stuff'

	logger.log('Bob created', { user: bob })
	logger.error(undefined, err)
}

function demo_logger_levels(logger) {
	//console.log('------------ testing all levels, in order ------------')
	ALL_LOG_LEVELS.forEach(level =>
		logger[level](`msg with level "${level}"`, { level, foo: 42 })
	)
}

function demo_incorrect_invocations(logger) {
	console.log('------------ incorrect invocation (bunyan style) ------------')
	logger.info()

	logger.info('hi')
	logger.info('hi %s', bob, more)

	logger.info({foo: 'bar'}, 'hi')

	logger.info(err)
	logger.info(err, 'more on this: %s', more)

	logger.info({foo: 'bar', err: err}, 'some msg about this error')
	logger.warn('foo', 'bar', 42)
}

function demo_logger_api() {
	console.log('------------ logger creation and basic usage ------------')
	const root_logger = getLogger({
		suggestedLevel: 'silly',
	})
	root_logger.log('hello from root logger')

	const logger = getLogger({
		name: 'Foo',
		suggestedLevel: 'silly',
	})
	logger.log('hello from a sub-logger')



	/*
   console.groupCollapsed('in group')
   ALL_LOG_LEVELS.forEach(level =>
       logger[level](`msg with level "${level}"`)
   )
   console.groupEnd()
   */
}

function demo_devtools_fonts() {
	console.log('------------ available font styles ------------')
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
		'Menlo',
		'Consolas',
		'"Lucida Console"',
		'"Courier New"',
		'monospace',
	].forEach(font => console.log(`%c${font}: ABCdefi012 %cABCdefi012`, `font-family: ${font};`, `font-family: unset;`))
}

addDebugCommand('demo_logger', demo_logger_api)

exposeInternal('foo.bar.baz', 42)

console.log('some value:', overrideHook('some-value', 'some default'))

console.log({ ...window._debug.v1 })
