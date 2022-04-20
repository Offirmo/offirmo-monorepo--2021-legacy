import { getRootSEC, SoftExecutionContext } from '@offirmo-private/soft-execution-context'

import { LIB } from './consts'

function get_lib_SEC(parent?: SoftExecutionContext): SoftExecutionContext {
	return (parent || getRootSEC())
		.createChild()
		.setLogicalStack({ module: LIB })
}

export {
	SoftExecutionContext,
	get_lib_SEC,
}
