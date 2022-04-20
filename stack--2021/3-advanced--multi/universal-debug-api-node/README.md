
<h1 align="center">
	Offirmo’s Universal Debug API - node implementation<br>
	<a href="https://www.offirmo.net/offirmo-monorepo/0-doc/modules-directory/index.html">
		<img src="https://www.offirmo.net/offirmo-monorepo/public/offirmos_quality_seal.png" alt="Offirmo’s quality seal" width="333">
	</a>
</h1>

<p align="center">
	<a alt="npm package page"
	  href="https://www.npmjs.com/package/@offirmo/universal-debug-api-node">
		<img alt="npm badge"
		  src="https://img.shields.io/npm/v/@offirmo/universal-debug-api-node.svg">
	</a>
	<a alt="dependencies analysis"
	  href="https://david-dm.org/offirmo/offirmo-monorepo?path=3-advanced--multi%2Funiversal-debug-api-node">
		<img alt="dependencies badge"
		  src="https://img.shields.io/david/offirmo/offirmo-monorepo.svg?path=3-advanced--multi%2Funiversal-debug-api-node">
	</a>
	<a alt="bundle size evaluation"
	  href="https://bundlephobia.com/result?p=@offirmo/universal-debug-api-node">
		<img alt="bundle size badge"
		  src="https://img.shields.io/bundlephobia/minzip/@offirmo/universal-debug-api-node.svg">
	</a>
	<a alt="license"
	  href="https://unlicense.org/">
		<img alt="license badge"
		  src="https://img.shields.io/badge/license-public_domain-brightgreen.svg">
	</a>
	<img alt="maintenance status badge"
	  src="https://img.shields.io/maintenance/yes/2022.svg">
</p>

**This is the node implementation of [Offirmo’s Universal Debug API](https://universal-debug-api-js.netlify.app/).**

## Usage

The Universal Debug API is exposed as expected:

```javascript
import {
	getLogger,
	overrideHook,
} from '@offirmo/universal-debug-api-node'

const logger = getLogger({ name: 'foo', suggestedLevel: 'info' })
logger.silly('Hello')
logger.verbose('Hello')
logger.fatal('Hello')

const DB_URL = overrideHook('db-url', 'https://prod.dev')
logger.info('DB URL=', {DB_URL})
```

Specific to the node version, overrides are set through ENV vars:

```bash
UDA_OVERRIDE__LOGGER_FOO_LOGLEVEL=verbose \
UDA_OVERRIDE__DB_URL=localhost:1234 \
node ./doc/demo.js
```

Because ENV vars format is restricted, keys are automatically normalized:
1. to upper case
1. separators chars `-.⋄∙ꘌꓺː` are converted to '_'

Though overrides values accept JSON (correctly escaped),
as a convenience because escaping is hard in shell and text files,
numbers are auto-converted and non-JSON values are defaulted to strings:

```bash
UDA_OVERRIDE__LOGGER_FOO_LOGLEVEL=\"verbose\" \
## is equivalent to
UDA_OVERRIDE__LOGGER_FOO_LOGLEVEL=verbose \
```

## Notes

> Why would I use a mechanism such as `overrideHook()` when I can simply read ENV vars?

Sure you can if your code is node only.
The point of the Universal Debug API is to be isomorphic,
for shared code.

For ex. the same code running on a browser could get its overrides from local storage.
