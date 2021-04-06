//import { ImmutabilityEnforcer } from '@offirmo-private/ts-types'
//import { enforce_immutability } from '@offirmo-private/state-utils'
import { BaseInjections, SoftExecutionContext } from '@offirmo-private/soft-execution-context'
import { Logger } from '@offirmo/practical-logger-types'

import { PRODUCT } from './consts'

/////////////////////

interface OMRInjections extends BaseInjections {
	logger: Logger
	//enforce_immutability: ImmutabilityEnforcer
}

type OMRSoftExecutionContext = SoftExecutionContext<OMRInjections>

/////////////////////

function decorate_SEC(SEC: OMRSoftExecutionContext): OMRSoftExecutionContext {
	/*SEC.injectDependencies({
		enforce_immutability, // TODO remove
	})*/

	SEC.setAnalyticsAndErrorDetails({
		product: PRODUCT, // TODO LIB?
		// TODO add more details
	})

	return SEC // for chaining
}

/////////////////////

export {
	OMRInjections,
	OMRSoftExecutionContext,
	decorate_SEC,
}
