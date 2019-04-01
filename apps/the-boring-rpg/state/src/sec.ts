import { getRootSEC } from '@offirmo-private/soft-execution-context'
import { SoftExecutionContext, OMRContext, decorate_SEC } from '@oh-my-rpg/definitions'

import { LIB } from './consts'

function get_lib_SEC(parent?: SoftExecutionContext): SoftExecutionContext {
	return decorate_SEC(
		(parent || getRootSEC())
			.createChild()
			.setLogicalStack({module: LIB})
			.setAnalyticsAndErrorDetails({
				sub_product: LIB,
			})
	)
}

export {
	SoftExecutionContext,
	OMRContext,
	get_lib_SEC,
}
