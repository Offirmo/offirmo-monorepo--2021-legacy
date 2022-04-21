
<h1 align="center">
	Offirmo’s Universal Debug API - TypeScript interfaces<br>
	<a href="https://www.offirmo.net/offirmo-monorepo/0-doc/modules-directory/index.html">
		<img src="https://www.offirmo.net/offirmo-monorepo/public/offirmos_quality_seal.png" alt="Offirmo’s quality seal" width="333">
	</a>
</h1>

<p align="center">
	<a alt="npm package page"
	  href="https://www.npmjs.com/package/@offirmo/universal-debug-api-interface">
		<img alt="npm badge"
		  src="https://img.shields.io/npm/v/@offirmo/universal-debug-api-interface.svg">
	</a>
	<a alt="dependencies analysis"
	  href="https://david-dm.org/offirmo/offirmo-monorepo?path=3-advanced--multi%2Funiversal-debug-api-interface">
		<img alt="dependencies badge"
		  src="https://img.shields.io/david/offirmo/offirmo-monorepo.svg?path=3-advanced--multi%2Funiversal-debug-api-interface">
	</a>
	<a alt="bundle size evaluation"
	  href="https://bundlephobia.com/result?p=@offirmo/universal-debug-api-interface">
		<img alt="bundle size badge"
		  src="https://img.shields.io/bundlephobia/minzip/@offirmo/universal-debug-api-interface.svg">
	</a>
	<a alt="license"
	  href="https://unlicense.org/">
		<img alt="license badge"
		  src="https://img.shields.io/badge/license-public_domain-brightgreen.svg">
	</a>
	<img alt="maintenance status badge"
	  src="https://img.shields.io/maintenance/yes/2022.svg">
</p>

This lib declares only TypeScript types/interfaces
* **No code, 0 bytes** = will do nothing to your bundle size.
* shared between several implementations
* you should most likely not use/interact with this lib directly

See overall explanation: [Offirmo’s Universal Debug API](https://universal-debug-api-js.netlify.app/).


## API

This lib contains and exposes TypeScript types describing a Universal Debug API,
to be used in any JS environment:

```js
import {
	getLogger,
	overrideHook,
	exposeInternal,
	addDebugCommand,
} from '@offirmo/universal-debug-api-<pick an implementation>'
```

### Loggers

Generic, basic loggers. See [@offirmo/practical-logger-types](../../2-foundation/practical-logger-types/README.md)

Though a default level is set,
it is expected that the level can be overriden at load time
(actual mechanism depending on the implementation, e.g. [browser](https://www.npmjs.com/package/@offirmo/universal-debug-api-browser) or [node](https://www.npmjs.com/package/@offirmo/universal-debug-api-node))

```js
import { getLogger } from '@offirmo/universal-debug-api-<pick an implementation>'

// trivial use
const logger1 = getLogger()
// ( msg = <string> , details = { <hash> } )
logger1.log('Hello!', { target: 'world' })

// advanced use
const logger2 = getLogger({
	name: 'cloud-sync',
	suggestedLevel: 'info',
	commonDetails: {
		serverId: 'xyz987',
	}
})
logger2.log('Hello!', { target: 'world' })
```

### Overrides

Allows to "hook" the resolution of an information at load time.

A default value must be provided.
It is expected that the actual value can be replaced at load time
(actual mechanism depending on the implementation, e.g. [browser](https://www.npmjs.com/package/@offirmo/universal-debug-api-browser) or [node](https://www.npmjs.com/package/@offirmo/universal-debug-api-node))

```js
import { overrideHook } from '@offirmo/universal-debug-api-<pick an implementation>'

// <T>( id: string, default_value: T ) => T
const is_debug_enabled = overrideHook('is-debug-enabled', false)
const cohort = overrideHook('experiment-cohort', 'not-enrolled')
```


### Debug commands
TODO, considered in alpha / unstable for now. Do not use, API change won't count as breaking change.

### Internal exposed for debug purposes
TODO, considered in alpha / unstable for now. Do not use, API change won't count as breaking change.


## Module usage

**This is most likely not what you are looking for!**

See the actual implementations of those interfaces:
* minimal no-op: [@offirmo/universal-debug-api-placeholder](https://www.npmjs.com/package/@offirmo/universal-debug-api-placeholder)
* browser: [@offirmo/universal-debug-api-browser](https://www.npmjs.com/package/@offirmo/universal-debug-api-browser)
* node: [@offirmo/universal-debug-api-node](https://www.npmjs.com/package/@offirmo/universal-debug-api-node)
