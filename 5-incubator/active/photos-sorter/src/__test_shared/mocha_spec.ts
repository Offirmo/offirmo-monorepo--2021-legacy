console.log('[Hello from mocha_specs.ts]')

import { exiftool } from 'exiftool-vendored'
import { getLogger } from '@offirmo/universal-debug-api-node'

after(() => exiftool.end())

// REM our mocha tool forces default to silly
const logger = getLogger()
//logger.setLevel('trace')
logger.setLevel('verbose')
//logger.setLevel('info')
