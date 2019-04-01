import { getRootSEC } from '@offirmo-private/soft-execution-context'

const LIB = 'ErrorBoundary'

function get_lib_SEC(parent) {
	return (parent || getRootSEC())
		.createChild()
		.setLogicalStack({module: LIB})
}

export {
	get_lib_SEC,
}
