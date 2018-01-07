import * as soft_execution_context from '@offirmo/soft-execution-context'

// TODO move to SEC lib when turned to TS
type SoftExecutionContext = any
interface BaseSECContext {
	SEC: SoftExecutionContext
	env: string
	logger: any
}

/////////////////////

type ImmutabilityEnforcer = <T>(v: T) => Readonly<T>

interface SECContext extends BaseSECContext {
	enforce_immutability: ImmutabilityEnforcer
	// TODO analytics ?
	// TODO details ?
}

const enforce_immutability: ImmutabilityEnforcer = (v) => v
//const enforce_immutability = (state: State) => deepFreeze(state)

function get_default_SEC_context() {
	return {
		enforce_immutability,
	}
}

function oh_my_rpg_get_SEC({module, parent_SEC}: {module: string, parent_SEC?: SoftExecutionContext}): SoftExecutionContext {
	if (parent_SEC && !soft_execution_context.isomorphic.isSEC(parent_SEC)) {
		// better error
		throw new Error(`@oh-my-rpg: missing sec when creating module "${module}"!`)
	}

	return soft_execution_context.isomorphic.create({
		parent: parent_SEC, // whether it exists or not
		module,
		context: {
			...get_default_SEC_context(),
		},
		// TODO add debug details, version, etc.
	})
}

/////////////////////

export {
	SoftExecutionContext,
	BaseSECContext,
	ImmutabilityEnforcer,
	SECContext,
	get_default_SEC_context,
	oh_my_rpg_get_SEC,
}
