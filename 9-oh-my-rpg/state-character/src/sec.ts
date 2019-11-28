import { getRootSEC } from '@offirmo-private/soft-execution-context'
import { SoftExecutionContext, OMRContext, decorate_SEC } from '@oh-my-rpg/definitions'

import { LIB } from './consts'

function get_lib_SEC(parent?: SoftExecutionContext): SoftExecutionContext {
	// TODO review memoize / not mutate the parent??
	return decorate_SEC(
		(parent || getRootSEC())
			.createChild()
			.setLogicalStack({module: LIB})
			.setAnalyticsAndErrorDetails({
				sub_product: 'state-character',
			}),
	)
}

export {
	SoftExecutionContext,
	OMRContext,
	get_lib_SEC,
}
