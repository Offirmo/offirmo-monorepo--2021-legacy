
<h1 align="center">
	Offirmo’s practical logger - node implementation<br>
	<a href="https://www.offirmo.net/offirmo-monorepo/0-doc/modules-directory/index.html">
		<img src="https://www.offirmo.net/offirmo-monorepo/public/offirmos_quality_seal.png" alt="Offirmo’s quality seal" width="333">
	</a>
</h1>

<p align="center">
	<a alt="npm package page"
	  href="https://www.npmjs.com/package/@offirmo/practical-logger-node">
		<img alt="npm badge"
		  src="https://img.shields.io/npm/v/@offirmo/practical-logger-node.svg">
	</a>
	<a alt="dependencies analysis"
	  href="https://david-dm.org/offirmo/offirmo-monorepo?path=2-foundation%2Fpractical-logger-node">
		<img alt="dependencies badge"
		  src="https://img.shields.io/david/offirmo/offirmo-monorepo.svg?path=2-foundation%2Fpractical-logger-node">
	</a>
	<a alt="bundle size evaluation"
	  href="https://bundlephobia.com/result?p=@offirmo/practical-logger-node">
		<img alt="bundle size badge"
		  src="https://img.shields.io/bundlephobia/minzip/@offirmo/practical-logger-node.svg">
	</a>
	<a alt="license"
	  href="https://unlicense.org/">
		<img alt="license badge"
		  src="https://img.shields.io/badge/license-public_domain-brightgreen.svg">
	</a>
	<img alt="maintenance status badge"
	  src="https://img.shields.io/maintenance/yes/2022.svg">
</p>

**This is a node implementation of [Offirmo’s practical logger](https://practical-logger-js.netlify.app/).**

## Demo

![dark terminal demo](./doc/screen-term-dark-alt.png)


## Usage

```javascript
import { createLogger } from '@offirmo/practical-logger-node'

const logger = createLogger()
logger.log('hello from logger!')

const fooLogger = createLogger({
	name: 'Foo',
	suggestedLevel: 'silly',
})
fooLogger.log('hello from fooLogger!', { bar: 42, baz: 33 })
```

TODO explanation

TODO https://www.stefanjudis.com/today-i-learned/node-js-has-a-built-in-debug-method/
