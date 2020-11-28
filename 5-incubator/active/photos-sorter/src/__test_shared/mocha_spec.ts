import { exiftool } from 'exiftool-vendored'
import { getLogger } from '@offirmo/universal-debug-api-node'

after(() => exiftool.end())


const logger = getLogger()
logger.setLevel('info')
