import memoize_once from 'memoize-one'
import { getRootSEC, SoftExecutionContext } from '@offirmo-private/soft-execution-context'


import { LIB } from '../consts'
import logger from './logger'

const get_lib_SEC = memoize_once(function _get_lib_SEC(parent?: SoftExecutionContext): SoftExecutionContext {
	// TODO review memoize?
	return (parent || getRootSEC())
		.createChild()
		.setLogicalStack({module: LIB})
		.injectDependencies({ logger })
})

export {
	SoftExecutionContext,
	get_lib_SEC,
}
