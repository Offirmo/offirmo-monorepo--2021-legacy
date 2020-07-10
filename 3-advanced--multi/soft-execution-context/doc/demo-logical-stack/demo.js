import { getRootSEC } from '../../src/index.js'
import { hello } from './lib.js'

const root_SEC = getRootSEC()
root_SEC.setLogicalStack({
	module: 'Demo app',
})

root_SEC.xTry('init', ({SEC}) => {
	hello('Offirmo', {SEC})
})
