
<h1 align="center">
	Better Error creation in JavaScript / TypeScript<br>
	<a href="https://www.offirmo.net/offirmo-monorepo/doc/modules-directory/index.html">
		<img src="https://www.offirmo.net/offirmo-monorepo/doc/quality-seal/offirmos_quality_seal.svg" alt="Offirmo’s quality seal">
	</a>
</h1>

<p align="center">
	<a alt="npm package page"
	  href="https://www.npmjs.com/package/@offirmo/create-error">
		<img alt="npm badge"
		  src="https://img.shields.io/npm/v/@offirmo/create-error.svg">
	</a>
	<a alt="dependencies analysis"
	  href="https://david-dm.org/offirmo/offirmo-monorepo?path=0-stdlib%2Fcreate-error">
		<img alt="dependencies badge"
		  src="https://img.shields.io/david/offirmo/offirmo-monorepo.svg?path=0-stdlib%2Fcreate-error">
	</a>
	<a alt="bundle size evaluation"
	  href="https://bundlephobia.com/result?p=@offirmo/create-error">
		<img alt="bundle size badge"
		  src="https://img.shields.io/bundlephobia/minzip/@offirmo/create-error.svg">
	</a>
	<a alt="license"
	  href="https://unlicense.org/">
		<img alt="license badge"
		  src="https://img.shields.io/badge/license-public_domain-brightgreen.svg">
	</a>
	<img alt="maintenance status badge"
	  src="https://img.shields.io/maintenance/yes/2019.svg">
</p>


## A slightly more convenient way to create errors than new Error(…)

Allows to pass "details" fields along the error creation, in one go.

### Usage
```typescript
import createError from '@offirmo/create-error'

// classic = it's the same
const err = new Error(`Foo API: bar is incorrect!`)
const err = createError(`Foo API: bar is incorrect!`)

// advanced
const err = createError(`Foo API: bar is incorrect!`, { status: })

```

See https://github.com/jshttp/http-errors
