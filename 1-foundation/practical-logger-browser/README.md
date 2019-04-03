
<h1 align="center">
	Offirmo’s practical logger - browser implementation<br>
	<a href="https://www.offirmo.net/offirmo-monorepo/doc/modules-directory/index.html">
		<img src="https://www.offirmo.net/offirmo-monorepo/doc/quality-seal/offirmos_quality_seal.svg" alt="Offirmo’s quality seal">
	</a>
</h1>

<p align="center">
	<a alt="npm package page"
	  href="https://www.npmjs.com/package/@offirmo/practical-logger-browser">
		<img alt="npm badge"
		  src="https://img.shields.io/npm/v/@offirmo/practical-logger-browser.svg">
	</a>
	<a alt="dependencies analysis"
	  href="https://david-dm.org/offirmo/offirmo-monorepo?path=1-foundation%2Fpractical-logger-browser">
		<img alt="dependencies badge"
		  src="https://img.shields.io/david/offirmo/offirmo-monorepo.svg?path=1-foundation%2Fpractical-logger-browser">
	</a>
	<a alt="bundle size evaluation"
	  href="https://bundlephobia.com/result?p=@offirmo/practical-logger-browser">
		<img alt="bundle size badge"
		  src="https://img.shields.io/bundlephobia/minzip/@offirmo/practical-logger-browser.svg">
	</a>
	<a alt="license"
	  href="https://unlicense.org/">
		<img alt="license badge"
		  src="https://img.shields.io/badge/license-public_domain-brightgreen.svg">
	</a>
	<img alt="maintenance status badge"
	  src="https://img.shields.io/maintenance/yes/2019.svg">
</p>

https://github.com/Offirmo/offirmo-monorepo/wiki/Offirmo%E2%80%99s-Practical-Logger

## Demo

TODO codepen

On Firefox:

![firefox demo](https://www.offirmo.net/offirmo-monorepo/doc/screen/firefox_20190402.png)

On Chrome:

![firefox demo](https://www.offirmo.net/offirmo-monorepo/doc/screen/chromium_20190402.png)

On Safari:

![firefox demo](https://www.offirmo.net/offirmo-monorepo/doc/screen/safari_20190402.png)


## Usage

**Note: for even more power, you may want to use TODO dev API instead of directly this lib!**

```javascript
import { createLogger } from '@offirmo/practical-logger-browser'

const logger = createLogger()
logger.log('hello from logger!')

const fooLogger = createLogger({
	name: 'Foo',
	suggestedLevel: 'silly',
})
fooLogger.log('hello from fooLogger!', { bar: 42, baz: 33 })
```

TODO explanation
