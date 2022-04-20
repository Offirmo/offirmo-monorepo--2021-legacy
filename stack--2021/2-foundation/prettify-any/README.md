A node module to conveniently print JSON.


## Introduction

Goals:
* ✅ readable
* safe, won't crash even if circular reference ✅ or huge object ✴️
* ✅ ability to copy/paste back to normal code (as much as possible)
* depending on the available space, will try to avoid wrapping if possible ✴️
* stable ✴️
* can help outline wrong JSON ✴️

Features:
- the sign of a negative zero is correctly displayed
- highlight "problem-ish" values = NaN, errors



https://www.json.org/json-en.html
https://thecodebarbarian.com/the-80-20-guide-to-json-stringify-in-javascript



## DEPRECATED

```ts
// "@offirmo-private/prettify-any": "^0",
import { prettify_json } from '@offirmo-private/prettify-any'

prettify_json({foo}, {outline: true, indent: 3})

import { dump_prettified_any } from '@offirmo-private/prettify-any'

dump_prettified_any('hello', {foo}, {outline: true, indent: 3})

```


Note: was formerly using prettyjson and got inspired by it.
"prettyjson": "^1"
"@types/prettyjson": "^0.0.30",
