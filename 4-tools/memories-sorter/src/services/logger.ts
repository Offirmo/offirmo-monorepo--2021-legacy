import { getLogger } from '@offirmo/universal-debug-api-node'

// Note: this is further overriden in unit tests
const logger = getLogger({
	//suggestedLevel: 'silly',
	//suggestedLevel: 'trace',
	//suggestedLevel: 'debug',
	//suggestedLevel: 'log',
	suggestedLevel: 'verbose',
	//suggestedLevel: 'info',
	//suggestedLevel: 'notice',
	//suggestedLevel: 'warn',
	//suggestedLevel: 'error',
})

export default logger
