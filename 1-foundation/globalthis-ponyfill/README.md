[![npm (scoped)](https://img.shields.io/npm/v/@offirmo/globalthis-ponyfill.svg)](https://www.npmjs.com/package/@offirmo/globalthis-ponyfill)
[![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@offirmo/globalthis-ponyfill.svg)](https://bundlephobia.com/result?p=@offirmo/globalthis-ponyfill)
[![license](http://img.shields.io/badge/license-public_domain-brightgreen.svg)](http://unlicense.org/)
![Maintenance](https://img.shields.io/maintenance/yes/2019.svg)


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
