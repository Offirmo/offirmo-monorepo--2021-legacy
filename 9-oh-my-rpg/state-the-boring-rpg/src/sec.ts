import { getRootSEC } from '@offirmo/soft-execution-context'
import { SoftExecutionContext, OMRContext } from '@oh-my-rpg/definitions'

import { LIB } from './consts'

function get_lib_SEC(parent?: SoftExecutionContext): SoftExecutionContext {
	return (parent || getRootSEC())
		.createChild()
		.setLogicalStack({module: LIB})
}

export {
	SoftExecutionContext,
	OMRContext,
	get_lib_SEC,
}
