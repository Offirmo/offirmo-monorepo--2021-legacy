import { ImmutabilityEnforcer } from '@offirmo-private/ts-types'
import { Logger } from '@offirmo/practical-logger-interface'
import { PRODUCT } from './consts'

/////////////////////
// TODO move to SEC lib when turned to TS

type SoftExecutionContext = any

interface BaseContext {
	SEC: SoftExecutionContext
	ENV: string
	logger: Logger
}

/////////////////////
// TODO move in final app (new module?)

interface OMRContext extends BaseContext {
	enforce_immutability: ImmutabilityEnforcer
	// TODO analytics ?
	// TODO details ?
}

/////////////////////

const enforce_immutability: ImmutabilityEnforcer = (x) => x
//const enforce_immutability = (state: State) => deepFreeze(state) TODO


function decorate_SEC(SEC: SoftExecutionContext): SoftExecutionContext {
	SEC.injectDependencies({
		enforce_immutability,
	})

	SEC.setAnalyticsAndErrorDetails({
		product: PRODUCT,
		// TODO add more details
	})

	return SEC // for chaining
}

/////////////////////

export {
	SoftExecutionContext,
	BaseContext,
	OMRContext,
	decorate_SEC,
}
