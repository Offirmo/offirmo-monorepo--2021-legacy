console.log('[Hello from mocha_specs.ts]')

import { exiftool } from 'exiftool-vendored'
import { getLogger } from '@offirmo/universal-debug-api-node'

after(() => exiftool.end())

// our mocha tool forces to silly
const logger = getLogger()
//logger.setLevel('silly')
logger.setLevel('info')
