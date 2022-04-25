import { getRootSEC, SoftExecutionContext } from '@offirmo-private/soft-execution-context'

import { LIB } from './consts'

// TODO review
function get_lib_SEC(parent?: SoftExecutionContext): SoftExecutionContext {
	return (parent || getRootSEC())
		.createChild()
		.setLogicalStack({module: LIB})
		.setAnalyticsAndErrorDetails({
			sub_product: LIB,
		})
}

export {
	SoftExecutionContext,
	get_lib_SEC,
}
