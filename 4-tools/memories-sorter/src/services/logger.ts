import { getLogger } from '@offirmo/universal-debug-api-node'

// Note: this is further overriden in unit tests
const logger = getLogger({
	//suggestedLevel: 'silly',
	//suggestedLevel: 'trace',
	// debug
	//suggestedLevel: 'log',
	suggestedLevel: 'verbose',
	// info
	// notice
	//suggestedLevel: 'warn',
	//suggestedLevel: 'error',
})

export default logger
