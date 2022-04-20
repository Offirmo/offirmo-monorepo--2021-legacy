
<h1 align="center">
	Tiny singleton<br>
	<a href="https://www.offirmo.net/offirmo-monorepo/0-doc/modules-directory/index.html">
		<img src="https://www.offirmo.net/offirmo-monorepo/public/offirmos_quality_seal.png" alt="Offirmo’s quality seal" width="333">
	</a>
</h1>

<p align="center">
	<a alt="npm package page"
	  href="https://www.npmjs.com/package/@offirmo/tiny-singleton">
		<img alt="npm badge"
		  src="https://img.shields.io/npm/v/@offirmo/tiny-singleton.svg">
	</a>
	<a alt="dependencies analysis"
	  href="https://david-dm.org/offirmo/offirmo-monorepo?path=1-stdlib%2Ftiny-singleton">
		<img alt="dependencies badge"
		  src="https://img.shields.io/david/offirmo/offirmo-monorepo.svg?path=1-stdlib%2Ftiny-singleton">
	</a>
	<a alt="bundle size evaluation"
	  href="https://bundlephobia.com/result?p=@offirmo/tiny-singleton">
		<img alt="bundle size badge"
		  src="https://img.shields.io/bundlephobia/minzip/@offirmo/tiny-singleton.svg">
	</a>
	<a alt="license"
	  href="https://unlicense.org/">
		<img alt="license badge"
		  src="https://img.shields.io/badge/license-public_domain-brightgreen.svg">
	</a>
	<img alt="maintenance status badge"
	  src="https://img.shields.io/maintenance/yes/2022.svg">
</p>


This is a trivial, isomorphic, straightforward, TypeScript-compatible [singleton](https://en.wikipedia.org/wiki/Singleton_pattern) implementation:
* NO dependencies
* lazily created on first use, as expected

Typical usage is when one wants to share a common object, for ex. a connection to a database, yet is able to create it if not already existing.

This lib is NOT a memoization lib in the sense that in this lib, subsequent calls with different parameters (if any) will still yield the first invocation result.


**Be sure to review your options** before using the singleton pattern!
While there are legitimate uses, it can also be a code smell
close to a global variable!

**See also:**
* [memoize-one](https://github.com/alexreardon/memoize-one) if you simply want a single call


### Usage


```typescript
// "@offirmo/tiny-singleton": "^1",

import tiny_singleton from '@offirmo/tiny-singleton'

// underlying function: exemple of a DB client is a correct case where the singleton pattern can be useful
function create_db_client(ip: string, logger: Console = console): DBClient {
	return ...
}

// example 1: best semantic
const get_db_client = tiny_singleton(() => create_db_client('127.0.0.1'))
get_db_client().read(1234).then(...)

// example 2: with params (not recommended as the params will only affect the 1st call, but sometimes convenient)
const get_db_client = tiny_singleton(create_db_client)

// alternative (not better, just an alternative example)
const get_db_client = tiny_singleton((options?: CreationOptions) => create_db_client(options.ip || '127.0.0.1'))

// usage
get_db_client('127.0.0.1')
get_db_client('1.2.3.4') // XXX This will return the same as above!! No new instance creation.
get_db_client().write('hello').then(...)
```
