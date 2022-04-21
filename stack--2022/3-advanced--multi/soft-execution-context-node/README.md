

```ts
import {
   listenToUncaughtErrors,
   listenToUnhandledRejections,
   decorateWithDetectedEnv,
   getRootSEC,
} from '@offirmo-private/soft-execution-context-node'
listenToUncaughtErrors()
listenToUnhandledRejections()
decorateWithDetectedEnv()

import { getLogger } from '@offirmo/universal-debug-api-node'
getRootSEC().injectDependencies({ logger: getLogger({ suggestedLevel: 'silly' }) })
```

https://thecodebarbarian.com/unhandled-promise-rejections-in-node.js.html

TODO integrate with async hooks? https://itnext.io/nodejs-logging-made-right-117a19e8b4ce
