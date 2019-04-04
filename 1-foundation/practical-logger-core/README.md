
<h1 align="center">
	Offirmo’s practical logger - JSON<br>
	<a href="https://www.offirmo.net/offirmo-monorepo/doc/modules-directory/index.html">
		<img src="https://www.offirmo.net/offirmo-monorepo/doc/quality-seal/offirmos_quality_seal.svg" alt="Offirmo’s quality seal">
	</a>
</h1>

<p align="center">
	<a alt="npm package page"
	  href="https://www.npmjs.com/package/@offirmo/practical-logger-core">
		<img alt="npm badge"
		  src="https://img.shields.io/npm/v/@offirmo/practical-logger-core.svg">
	</a>
	<a alt="dependencies analysis"
	  href="https://david-dm.org/offirmo/offirmo-monorepo?path=1-foundation%2Fpractical-logger-core">
		<img alt="dependencies badge"
		  src="https://img.shields.io/david/offirmo/offirmo-monorepo.svg?path=1-foundation%2Fpractical-logger-core">
	</a>
	<a alt="bundle size evaluation"
	  href="https://bundlephobia.com/result?p=@offirmo/practical-logger-core">
		<img alt="bundle size badge"
		  src="https://img.shields.io/bundlephobia/minzip/@offirmo/practical-logger-core.svg">
	</a>
	<a alt="license"
	  href="https://unlicense.org/">
		<img alt="license badge"
		  src="https://img.shields.io/badge/license-public_domain-brightgreen.svg">
	</a>
	<img alt="maintenance status badge"
	  src="https://img.shields.io/maintenance/yes/2019.svg">
</p>

This is an **internal / technical** component of [Offirmo’s practical logger](https://github.com/Offirmo/offirmo-monorepo/wiki/Offirmo%E2%80%99s-Practical-Logger). 
* isomorphic code for node and browser
* TODO explain the interface pattern


## Usage

**This is most likely not what you are looking for!**

See the final implementations using this module:
* minimal no-op: [@offirmo/practical-logger-minimal-noop](https://www.npmjs.com/package/@offirmo/practical-logger-minimal-noop)
* browser: [@offirmo/practical-logger-browser](https://www.npmjs.com/package/@offirmo/practical-logger-browser)
* node: TODO publish to npm

**if you know what you are doing:**

While this module was made to be a component in a final logger sink,
it is a perfectly working logger
which will output JSON lines to stdout, corresponding to log lines,
in the same way [bunyan](https://github.com/trentm/node-bunyan) does.
In fact, the output should be compatible (not tested)

```javascript
import { createLogger } from '@offirmo/practical-logger-core'

const logger = createLogger({ /* ... */ })

logger.verbose('foo', { bar: 42, baz: 33 })
```

Advanced usage:
```typescript
import { createLogger, LogPayload } from '@offirmo/practical-logger-core'

function sink(payload: LogPayload) {
    const {
        level,
        name,
        msg,
        time,
        err,
        details
    } = payload
    /* ... */
}

const logger = createLogger({ /* ... */ }, sink)

logger.verbose('foo', { bar: 42, baz: 33 })
```
