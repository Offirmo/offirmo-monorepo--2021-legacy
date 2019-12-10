
<h1 align="center">
	Tiny singleton<br>
	<a href="https://www.offirmo.net/offirmo-monorepo/0-doc/modules-directory/index.html">
		<img src="https://www.offirmo.net/offirmo-monorepo/0-doc/quality-seal/offirmos_quality_seal.svg" alt="Offirmo’s quality seal">
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
	  src="https://img.shields.io/maintenance/yes/2019.svg">
</p>


This is a trivial, straightforward TypeScript-compatible singleton
* NO dependencies

### Usage

Note: lazily created on 1st use, of course!

```typescript
// "@offirmo/tiny-singleton": "^0",
import tiny_singleton from '@offirmo/tiny-singleton'

interface DBClient {
	read: (id: number): Promise<void>
	write: (stuff: string): Promise<void>
}

function create_client(ip: string, logger: Console = console): DBClient {
	return ...
}

// use an intermediate function to typecheck the params
const get_client = tiny_singleton(() => create_client('127.0.0.1'))
get_client().read(1234).then(...)

// or not, params should be propagated (depending on your usage
const get_client = tiny_singleton((options?: CreationOptions) => create_client(options.ip || '127.0.0.1'))
get_client('127.0.0.1')
get_client().write('hello').then(...)
```
