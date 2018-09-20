import { getRootSEC } from '../../src/index.js'

const LIB = 'FOO'

function get_lib_SEC(parent) {
	// TODO memoize?
	return (parent || getRootSEC())
		.createChild()
		.setLogicalStack({module: LIB})
}

function hello(target, {SEC} = {}) {
	get_lib_SEC(SEC).xTry(hello.name, ({SEC, logger}) => {
		logger.info('short:', SEC.getShortLogicalStack())
		logger.info('long:', SEC.getLogicalStack())
		logger.log('misc', {
			SEC,
		})
	})
}


export {
	LIB,
	hello,
}
