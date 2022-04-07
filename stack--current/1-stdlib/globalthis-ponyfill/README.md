
<h1 align="center">
	globalThis ponyfill<br>
	<a href="https://www.offirmo.net/offirmo-monorepo/0-doc/modules-directory/index.html">
		<img src="https://www.offirmo.net/offirmo-monorepo/public/offirmos_quality_seal.png" alt="Offirmo’s quality seal" width="333">
	</a>
</h1>

<p align="center">
	<a alt="npm package page"
	  href="https://www.npmjs.com/package/@offirmo/globalthis-ponyfill">
		<img alt="npm badge"
		  src="https://img.shields.io/npm/v/@offirmo/globalthis-ponyfill.svg">
	</a>
	<a alt="dependencies analysis"
	  href="https://david-dm.org/offirmo/offirmo-monorepo?path=1-stdlib%2Fglobalthis-ponyfill">
		<img alt="dependencies badge"
		  src="https://img.shields.io/david/offirmo/offirmo-monorepo.svg?path=1-stdlib%2Fglobalthis-ponyfill">
	</a>
	<a alt="bundle size evaluation"
	  href="https://bundlephobia.com/result?p=@offirmo/globalthis-ponyfill">
		<img alt="bundle size badge"
		  src="https://img.shields.io/bundlephobia/minzip/@offirmo/globalthis-ponyfill.svg">
	</a>
	<a alt="license"
	  href="https://unlicense.org/">
		<img alt="license badge"
		  src="https://img.shields.io/badge/license-public_domain-brightgreen.svg">
	</a>
	<img alt="maintenance status badge"
	  src="https://img.shields.io/maintenance/yes/2022.svg">
</p>


This is a trivial TypeScript-compatible [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) [ponyfill](https://ponyfill.com/).
* very small minzipped size
* NO dependencies
* doesn't alter the environment ([ponyfill](https://ponyfill.com/))
* compatible with node & browser


## Usage
```js
import { getGlobalThis } from '@offirmo/globalthis-ponyfill'

const globalThis = getGlobalThis()
```


## Rationale

* `globalThis` is a [TC-39 proposal](https://github.com/tc39/proposal-global)
 which is [already supported by Firefox and Chrome](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis).
* There are existing ponyfills/polyfills [out there](https://github.com/ljharb/globalThis), but they didn't work for me:
  * mine is much simpler: a single TS file of 6 meaningful lines
  * I needed TypeScript
  * a [ponyfill](https://ponyfill.com/) is better than a polyfill, it doesn't patch the environment.




## Credits

**YES** I had a look at [ljharb/globalThis](https://github.com/ljharb/globalThis) 's [implementation](https://github.com/ljharb/globalThis/blob/master/implementation.js) (MIT)
and started my implementation from it! Thanks a lot and all credits due!

About the proposed implementation here: https://mathiasbynens.be/notes/globalthis we can't use it: it creates a polyfill, not a ponyfill.
However I took a line from the "naive implementation".
