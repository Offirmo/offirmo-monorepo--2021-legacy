[![NPM version](https://badge.fury.io/js/network-constants.png)](http://badge.fury.io/js/@offirmo/globalthis-ponyfill)

## A trivial, TypeScript-compatible [ponyfill](https://ponyfill.com/) for [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis)


This is a trivial TypeScript-compatible [`globalThis`](https://github.com/tc39/proposal-global) [ponyfill](https://ponyfill.com/).
* ~141b minified and gzipped
* NO dependencies


## Usage:
```js
import { getGlobalThis } from '@offirmo/globalthis-ponyfill'

const globalThis = getGlobalThis()
```


## Rationale

* `globalThis` is a [TC-39 proposal](https://github.com/tc39/proposal-global)
 which is [already supported by Firefox and Chrome](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis).
* a [ponyfill](https://ponyfill.com/) is a better polyfill that doesn't patch the environment.

There are existing ponyfill/polyfill [out there](https://github.com/ljharb/globalThis), but they didn't work for me:
* too complicated: mine is a single TS file of 5 lines
* I needed TypeScript


## Credits

**YES** I had a look at [ljharb/globalThis](https://github.com/ljharb/globalThis)'s [implementation](https://github.com/ljharb/globalThis/blob/master/implementation.js)
and started my implementation from it! Thanks a lot and all credits due!
