import { getLogger, addDebugCommand } from './logger'
const { ALL_LOG_LEVELS } = require('@offirmo/practical-logger-core')

console.warn(`📄 [page/script.${+Date.now()}] page’s js starting…`)

const standard_console = false

if (standard_console) console.log('------------ standard console ------------')
if (standard_console) console.error('Standard console "error"')
if (standard_console) console.warn('Standard console "warn"')
if (standard_console) console.info('Standard console "info"')
if (standard_console) console.log('Standard console "log"')
if (standard_console) console.debug('Standard console "debug"')


if (standard_console) console.log('------------ logger creation and basic usage ------------')
const root_logger = getLogger({
	suggestedLevel: 'silly',
})
root_logger.log('Starting up')

const logger = getLogger({
	name: 'Persistence',
	suggestedLevel: 'silly',
})
logger.verbose('Restoring state…')
logger.warn('Restoration is taking more time than usual', { elapsedMs: 3000 })

const err = new Error('Timeout loading state!')
err.httpStatus = 418 // to check that custom props are preserved

const bob = {
	firstName: 'Bob',
	lastName: 'Dupont',
	age: 42,
}
const more = 'some stuff'

logger.verbose('Current user loaded', { user: bob })
logger.error(undefined, err)

if (standard_console) console.log('------------ testing all levels, in order ------------')
ALL_LOG_LEVELS.forEach(level =>
	logger[level](`msg with level "${level}"`, { level })
)
if (standard_console) console.groupCollapsed('in group')
// TODO support groupX()
if (standard_console) {
	ALL_LOG_LEVELS.forEach(level =>
		logger[level](`msg with level "${level}"`, { level })
	)
}
if (standard_console) console.groupEnd()

if (standard_console) console.log('------------ incorrect invocation (bunyan style) ------------')
logger.info()

logger.info('hi')
logger.info('hi %s', bob, more)

logger.info({foo: 'bar'}, 'hi')

logger.info(err)
logger.info(err, 'more on this: %s', more)

logger.info({foo: 'bar', err: err}, 'some msg about this error')
logger.warn('foo', 'bar', 42)


if (false) {
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
