
<h1 align="center">
	Deferred promise pattern<br>
	<a href="https://www.offirmo.net/offirmo-monorepo/0-doc/modules-directory/index.html">
		<img src="https://www.offirmo.net/offirmo-monorepo/public/offirmos_quality_seal.png" alt="Offirmo’s quality seal" width="333">
	</a>
</h1>

<p align="center">
	<a alt="npm package page"
	  href="https://www.npmjs.com/package/@offirmo/deferred">
		<img alt="npm badge"
		  src="https://img.shields.io/npm/v/@offirmo/deferred.svg">
	</a>
	<a alt="dependencies analysis"
	  href="https://david-dm.org/offirmo/offirmo-monorepo?path=1-stdlib%2Fdeferred">
		<img alt="dependencies badge"
		  src="https://img.shields.io/david/offirmo/offirmo-monorepo.svg?path=1-stdlib%2Fdeferred">
	</a>
	<a alt="bundle size evaluation"
	  href="https://bundlephobia.com/result?p=@offirmo/deferred">
		<img alt="bundle size badge"
		  src="https://img.shields.io/bundlephobia/minzip/@offirmo/deferred.svg">
	</a>
	<a alt="license"
	  href="https://unlicense.org/">
		<img alt="license badge"
		  src="https://img.shields.io/badge/license-public_domain-brightgreen.svg">
	</a>
	<img alt="maintenance status badge"
	  src="https://img.shields.io/maintenance/yes/2022.svg">
</p>


## A simple, TypeScript typed implementation of the deferred pattern

This is seldom used but useful sometimes.

**Be sure to review your options** before using the deferred pattern over a simple promise.

Note: no dependencies!

### Usage
```typescript
import Deferred from '@offirmo/deferred'

const promise = new Deferred<T>()

// it's an unresolved promise, you can attach stuff
promise.then(console.log).catch(...)

// later:
promise.resolve(...)
promise.reject(new Error('Foo!'))
```

## Credits

Iterated from https://github.com/Microsoft/TypeScript/issues/15202#issuecomment-318900991
