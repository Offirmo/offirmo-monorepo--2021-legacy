
<h1 align="center">
	Offirmo’s practical logger - <a href="https://en.wikipedia.org/wiki/NOP_(code)">no op</a> implementation<br>
	<a href="https://www.offirmo.net/offirmo-monorepo/0-doc/modules-directory/index.html">
		<img src="https://www.offirmo.net/offirmo-monorepo/public/offirmos_quality_seal.png" alt="Offirmo’s quality seal" width="333">
	</a>
</h1>

<p align="center">
	<a alt="npm package page"
	  href="https://www.npmjs.com/package/@offirmo/practical-logger-minimal-noop">
		<img alt="npm badge"
		  src="https://img.shields.io/npm/v/@offirmo/practical-logger-minimal-noop.svg">
	</a>
	<a alt="dependencies analysis"
	  href="https://david-dm.org/offirmo/offirmo-monorepo?path=2-foundation%2Fpractical-logger-minimal-noop">
		<img alt="dependencies badge"
		  src="https://img.shields.io/david/offirmo/offirmo-monorepo.svg?path=2-foundation%2Fpractical-logger-minimal-noop">
	</a>
	<a alt="bundle size evaluation"
	  href="https://bundlephobia.com/result?p=@offirmo/practical-logger-minimal-noop">
		<img alt="bundle size badge"
		  src="https://img.shields.io/bundlephobia/minzip/@offirmo/practical-logger-minimal-noop.svg">
	</a>
	<a alt="license"
	  href="https://unlicense.org/">
		<img alt="license badge"
		  src="https://img.shields.io/badge/license-public_domain-brightgreen.svg">
	</a>
	<img alt="maintenance status badge"
	  src="https://img.shields.io/maintenance/yes/2022.svg">
</p>

**This is a minimal, no-operation implementation of [Offirmo’s practical logger](https://practical-logger-js.netlify.app/).**

Use this lib if you want to provide a default implementation,
for example as a default value in a dependency injection mechanism,
ready to be replaced by an actual version if the caller wants it,
but not hurting the bundle size if the user opts out.

### API
Exact same API as `@offirmo/practical-logger-browser` and `@offirmo/practical-logger-node`:
```javascript
import { createLogger } from '@offirmo/practical-logger-minimal-noop'

const logger = createLogger()
logger.log('hello from logger!') // absolutely nothing happens, no-op
```
