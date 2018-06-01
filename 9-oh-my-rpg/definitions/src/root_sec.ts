/////////////////////
// TODO move to SEC lib when turned to TS

type SoftExecutionContext = any

interface BaseContext {
	SEC: SoftExecutionContext
	ENV: string
	logger: any
}

/////////////////////
// TODO move in final app (new module?)

type ImmutabilityEnforcer = <T>(v: T) => Readonly<T>

interface OMRContext extends BaseContext {
	enforce_immutability: ImmutabilityEnforcer
	// TODO analytics ?
	// TODO details ?
}

/////////////////////

const enforce_immutability: ImmutabilityEnforcer = (v) => v
//const enforce_immutability = (state: State) => deepFreeze(state) TODO


function enrich_SEC(SEC: SoftExecutionContext): void {
	SEC.injectDependencies({
		enforce_immutability,

	})
	// TODO add debug details, version, etc.
}

/////////////////////

export {
	SoftExecutionContext,
	BaseContext,
	ImmutabilityEnforcer,
	OMRContext,
	enrich_SEC,
}
