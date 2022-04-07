
<h1 align="center">
	Offirmo’s Universal Debug API - browser implementation<br>
	<a href="https://www.offirmo.net/offirmo-monorepo/0-doc/modules-directory/index.html">
		<img src="https://www.offirmo.net/offirmo-monorepo/public/offirmos_quality_seal.png" alt="Offirmo’s quality seal" width="333">
	</a>
</h1>

<p align="center">
	<a alt="npm package page"
	  href="https://www.npmjs.com/package/@offirmo/universal-debug-api-browser">
		<img alt="npm badge"
		  src="https://img.shields.io/npm/v/@offirmo/universal-debug-api-browser.svg">
	</a>
	<a alt="dependencies analysis"
	  href="https://david-dm.org/offirmo/offirmo-monorepo?path=3-advanced--multi%2Funiversal-debug-api-browser">
		<img alt="dependencies badge"
		  src="https://img.shields.io/david/offirmo/offirmo-monorepo.svg?path=3-advanced--multi%2Funiversal-debug-api-browser">
	</a>
	<a alt="bundle size evaluation"
	  href="https://bundlephobia.com/result?p=@offirmo/universal-debug-api-browser">
		<img alt="bundle size badge"
		  src="https://img.shields.io/bundlephobia/minzip/@offirmo/universal-debug-api-browser.svg">
	</a>
	<a alt="license"
	  href="https://unlicense.org/">
		<img alt="license badge"
		  src="https://img.shields.io/badge/license-public_domain-brightgreen.svg">
	</a>
	<img alt="maintenance status badge"
	  src="https://img.shields.io/maintenance/yes/2022.svg">
</p>

**This is the browser implementation of [Offirmo’s Universal Debug API](https://universal-debug-api-js.netlify.app/).**

## Usage

The Universal Debug API is exposed as expected:

```javascript
import {
	getLogger,
	overrideHook,
} from '@offirmo/universal-debug-api-browser'

const logger = getLogger({ name: 'foo', suggestedLevel: 'info' })
logger.silly('Hello')
logger.verbose('Hello')
logger.fatal('Hello')

const SERVER_URL = overrideHook('server-url', 'https://prod.dev')
logger.info('Server URL=', {SERVER_URL})
```

Specific to the browser version, overrides are set through local storage:

```
localStorage.setItem('🛠UDA.override.logger.foo.logLevel', '"verbose"')
localStorage.setItem('🛠UDA.override.server-url', '"https://prod.dev"')
// loglevel || ll => log level
// cohort || co => experiment cohort
// is has should was will => boolean
```

Don't forget that overrides accept only JSON!

Debug:
```
localStorage.setItem('🛠UDA.override.logger._UDA_internal.logLevel', '"silly"')
```

## Notes

> Why would I use a mechanism such as `overrideHook()` when I can simply read local storage?

Sure you can if your code is browser only.
The point of the Universal Debug API is to be isomorphic,
for shared code.

For ex. the same code running on node will get its overrides from ENV vars.
