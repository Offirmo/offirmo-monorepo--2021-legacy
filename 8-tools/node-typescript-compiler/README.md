# node-typescript-compiler
[![NPM version](https://badge.fury.io/js/node-typescript-compiler.png)](http://badge.fury.io/js/node-typescript-compiler)
[![license](http://img.shields.io/badge/license-public_domain-brightgreen.png)](http://unlicense.org/)

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

TODO 
- option as array
- newline filtering
- reset screen on watch
