import { getLogger } from '@offirmo/universal-debug-api-node'

// Note: this is further overriden in unit tests
const logger = getLogger({
	//suggestedLevel: 'silly',
	//suggestedLevel: 'trace',
	//suggestedLevel: 'log',
	suggestedLevel: 'verbose',
	//suggestedLevel: 'warn',
	//suggestedLevel: 'error',
})

export default logger
