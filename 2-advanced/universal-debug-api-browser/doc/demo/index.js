import * as api from '../..'

import { demo_full } from '../../../../2-advanced/universal-debug-api-minimal-noop/doc/demo/demo.js'

/////////////////////

console.warn(`📄 [page/script.${+Date.now()}] page’s js starting…`)

/////////////////////

demo_full(api)
