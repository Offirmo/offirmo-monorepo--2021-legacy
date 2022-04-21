
<h1 align="center">
	Utilities for better error creation and manipulation in JavaScript / TypeScript<br>
	<a href="https://www.offirmo.net/offirmo-monorepo/0-doc/modules-directory/index.html">
		<img src="https://www.offirmo.net/offirmo-monorepo/public/offirmos_quality_seal.png" alt="Offirmo’s quality seal" width="333">
	</a>
</h1>

<p align="center">
	<a alt="npm package page"
	  href="https://www.npmjs.com/package/@offirmo/error-utils">
		<img alt="npm badge"
		  src="https://img.shields.io/npm/v/@offirmo/error-utils.svg">
	</a>
	<a alt="dependencies analysis"
	  href="https://david-dm.org/offirmo/offirmo-monorepo?path=2-foundation%2Ferror-utils">
		<img alt="dependencies badge"
		  src="https://img.shields.io/david/offirmo/offirmo-monorepo.svg?path=2-foundation%2Ferror-utils">
	</a>
	<a alt="bundle size evaluation"
	  href="https://bundlephobia.com/result?p=@offirmo/error-utils">
		<img alt="bundle size badge"
		  src="https://img.shields.io/bundlephobia/minzip/@offirmo/error-utils.svg">
	</a>
	<a alt="license"
	  href="https://unlicense.org/">
		<img alt="license badge"
		  src="https://img.shields.io/badge/license-public_domain-brightgreen.svg">
	</a>
	<img alt="maintenance status badge"
	  src="https://img.shields.io/maintenance/yes/2022.svg">
</p>

Some utilities around JavaScript Error creation and manipulation.
* written in TypeScript
* no dependencies

## Usage

### Exposed constants: known error fields

Exposes the properties we can expect on a JavaScript "Error" object.

See the source code for more details.

```typescript
import {
	STRICT_STANDARD_ERROR_FIELDS,
	QUASI_STANDARD_ERROR_FIELDS,
	COMMON_ERROR_FIELDS,
	COMMON_ERROR_FIELDS_EXTENDED,
} from '@offirmo/error-utils'
```

Note that `COMMON_ERROR_FIELDS_EXTENDED` contains private properties of my utilities,
but since they are optional and have rare names, there shouldn't be any conflict.

### Exposed types: error interface with more properties

* `XError` (eXtended error) = with properties up to `COMMON_ERROR_FIELDS`
* `XXError` = idem with properties up to `COMMON_ERROR_FIELDS_EXTENDED`

```typescript
import {
	XError,
	XXError,
} from '@offirmo/error-utils'
```

### Utility: slightly more convenient way to create errors than new Error(…)

Allows passing additional properties along the error creation, in one go.
* if the properties are recognized as top level (`COMMON_ERROR_FIELDS_EXTENDED`) they'll be attached directly
* if not, they'll be attached to a root `details` property

Also:
* Will ensure that the string "error" is present in the message (case-insensitive), will prepend it if not
* Will pick the message from the details as a fallback if the 1st param is not provided/falsy (convenience for rare cases)

```typescript
import { createError } from '@offirmo/error-utils'

// classic = it's the same
const err = new Error(`Foo API: bar is incorrect!`)
const err = createError(`Foo API: bar is incorrect!`) // return type = XXError

// advanced: extra properties
const err = createError(`Foo API: bar is incorrect!`, { statusCode: 401, foo: 'bar' })

// advanced: extra properties + custom constructor
const err = createError(`Foo API: bar is incorrect!`, { statusCode: 401, foo: 'bar' }, TypeError)
// above is equivalent to:
const err = new TypeError(`Foo API: bar is incorrect!`)
err.statusCode = 401
err.details = {
	foo: 'bar',
}
```

### Utility: normalize anything into a true Error object

Normalize anything into a true, normal error.

Anything can be thrown in JavaScript: `undefined`, string, number...
But that's obviously not a good practice.
Even Error-like objects are sometime fancy:
- seen: in a browser, sometimes, an error-like, un-writable object is thrown
- seen: frozen
- seen: non-enumerable props

So we want to ensure a true (has the shape), safe error object.

**writable version: `{ alwaysRecreate: true }`**
- sometimes we want to further decorate the error object, hence the need for writable version = a copy (for immutability)
- **NOTE:** will *always* recreate the error


```typescript
import { normalizeError } from '@offirmo/error-utils'

try {
	...(unreliable code)
}
catch (_err) {
	const err = normalizeError(_err)
	if (err.message === '...') {
		// ...
	}
	throw err
}

try {
...(unreliable code)
}
catch (_err) {
  const err = normalizeError(_err, { alwaysRecreate: true })
  err.statusCode = 500
  throw err
}
```


## See also
* https://github.com/jshttp/http-errors
