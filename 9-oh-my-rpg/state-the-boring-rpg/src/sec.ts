import { SoftExecutionContext, SECContext, get_default_SEC_context, oh_my_rpg_get_SEC } from '@oh-my-rpg/definitions'

import { LIB_ID, SCHEMA_VERSION } from './consts'

function get_SEC(SEC?: SoftExecutionContext): SoftExecutionContext {
	return oh_my_rpg_get_SEC({
		module: LIB_ID,
		parent_SEC: SEC,
	})
	// TODO add details: schema version
}

export {
	SoftExecutionContext,
	SECContext,
	get_SEC,
}
