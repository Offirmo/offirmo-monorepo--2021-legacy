
<h1 align="center">
	node-typescript-compiler<br>
	<a href="https://www.offirmo.net/offirmo-monorepo/doc/modules-directory/index.html">
		<img src="https://www.offirmo.net/offirmo-monorepo/doc/quality-seal/offirmos_quality_seal.svg" alt="Offirmo’s quality seal">
	</a>
</h1>

<p align="center">
	<a alt="npm package page"
		href="https://www.npmjs.com/package/node-typescript-compiler">
		<img alt="npm badge"
			src="https://img.shields.io/npm/v/node-typescript-compiler.svg">
	</a>
	<a alt="dependencies analysis"
		href="https://david-dm.org/offirmo/offirmo-monorepo?path=4-incubator%2Fhello-world-npm">
		<img alt="dependencies badge"
			src="https://img.shields.io/david/offirmo/offirmo-monorepo.svg?path=4-incubator%2Fhello-world-npm">
	</a>
	<a alt="license"
		href="https://unlicense.org/">
		<img alt="license badge"
			src="https://img.shields.io/badge/license-public_domain-brightgreen.svg">
	</a>
		<img alt="maintenance status badge"
			src="https://img.shields.io/maintenance/yes/2019.svg">
</p>


Exposes typescript compiler (tsc) as a node.js module

Allows you to invoke `tsc` from a node program.

This work trivially by spawning `tsc` from the sibling `node_modules/typescript` module.


## installation
**node-typescript-compiler** requires the **typescript module** as a sibling, not included so you can choose version.
(though node-typescript-compiler will intelligently try to locate global typescript if it can't be found as a sibling. but this is not recommended)

```bash
npm i --save-dev typescript
npm i --save-dev node-typescript-compiler
```

## Usage

The module exposes a unique function, `compile({options}, [files])`,
`files` being an optional array,
and `options` a hashmap of [tsc options](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

Example invocations:

* Compile current project:

```js
const tsc = require('node-typescript-compiler')
tsc.compile({
	'project': '.'
})
.then(...)
```
--> Will spawn `tsc --project .`

* Compile current project with some options overridden:

```js
const tsc = require('node-typescript-compiler')
const tsconfig = { json: require('../tsconfig.json') }

tsc.compile(
	Object.assign({}, tsconfig.json.compilerOptions, {
		'declaration': false,
		'outDir': 'dist/es6.amd',
		'module': 'amd'
	}),
	tsconfig.json.files,
)
```
--> Will spawn `tsc <... non-overriden tsconfig options> --outDir dist/es6.amd --module amd`
 (boolean "false" values cause the corresponding option to not be added, this is the intended behaviour)

* Get help:

```js
const tsc = require('node-typescript-compiler')

return tsc.compile({
	'help': true
})
```
--> Will spawn `tsc --help` (boolean "true" values are not needed thus don't appear, option presence is enough)

## design considerations
It seems we could do that more elegantly and at a lower level by directly calling tsc code, as explained here: https://basarat.gitbooks.io/typescript/content/docs/compiler/overview.html

However, that would take a lot of time and effort, and I'm afraid of API changes. So *no*.

## see also
https://www.npmjs.com/package/ntypescript but they have poor doc and don't allow choosing the typescript version (ex. using the unstable "next")

TODO note ts comp
- option as array
- newline filtering
- reset screen on watch
