A node module to conveniently print JSON.


## Introduction
Goals:
* readable
* ability to copy/paste as normal code
* depending on the available space, will try to avoid wrapping if possible

```ts
// "@offirmo-private/prettify-js": "^0",
import prettify_json from '@offirmo-private/prettify-js'

prettify_json({foo}, {outline: true, indent: 3})

import { dump_pretty_json } from '@offirmo-private/prettify-js'

dump_pretty_json('hello', {foo}, {outline: true, indent: 3})

```


Note: was formerly using prettyjson and got inspired by it.
