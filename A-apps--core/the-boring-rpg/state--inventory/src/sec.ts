import { getRootSEC } from '@offirmo-private/soft-execution-context'
import { OMRSoftExecutionContext, decorate_SEC } from '@oh-my-rpg/definitions'

import { LIB } from './consts'

function get_lib_SEC(parent?: OMRSoftExecutionContext): OMRSoftExecutionContext {
	return decorate_SEC(
		(parent || getRootSEC())
			.createChild()
			.setLogicalStack({module: LIB})
			.setAnalyticsAndErrorDetails({
				sub_product: 'state-inventory',
			}),
	)
}

export {
	OMRSoftExecutionContext,
	get_lib_SEC,
}
