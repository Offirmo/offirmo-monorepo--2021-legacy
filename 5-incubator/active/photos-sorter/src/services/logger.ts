import { getLogger } from '@offirmo/universal-debug-api-node'

const logger = getLogger({
	//suggestedLevel: 'silly',
	//suggestedLevel: 'trace',
	//suggestedLevel: 'log',
	suggestedLevel: 'verbose',
})

export default logger
