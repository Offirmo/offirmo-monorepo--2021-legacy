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

const enforce_immutability: ImmutabilityEnforcer = (x) => x
//const enforce_immutability = (state: State) => deep_freeze(state) TODO


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
