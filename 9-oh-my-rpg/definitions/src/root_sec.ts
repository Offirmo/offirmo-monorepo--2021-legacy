//import deep_freeze from 'deep-freeze-strict'
import icepick from 'icepick'

import { ImmutabilityEnforcer } from '@offirmo-private/ts-types'
import { BaseInjections, SoftExecutionContext } from '@offirmo-private/soft-execution-context'
import { Logger } from '@offirmo/practical-logger-types'

import { PRODUCT } from './consts'

/////////////////////

interface OMRInjections extends BaseInjections {
	logger: Logger
	enforce_immutability: ImmutabilityEnforcer
}

type OMRSoftExecutionContext = SoftExecutionContext<OMRInjections>

/////////////////////

//const enforce_immutability: ImmutabilityEnforcer = (state: T): T => state
//const enforce_immutability = <T>(state: T): T => deep_freeze<T>(state)
const enforce_immutability = <T>(state: T): T => icepick.freeze<T>(state)


function decorate_SEC(SEC: OMRSoftExecutionContext): OMRSoftExecutionContext {
	SEC.injectDependencies({
		enforce_immutability,
	})

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
