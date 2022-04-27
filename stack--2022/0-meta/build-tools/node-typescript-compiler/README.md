
<h1 align="center">
	node-typescript-compiler<br>
	<a href="https://www.offirmo.net/offirmo-monorepo/0-doc/modules-directory/index.html">
		<img src="https://www.offirmo.net/offirmo-monorepo/public/offirmos_quality_seal.png" alt="Offirmo’s quality seal" width="333">
	</a>
</h1>

<p align="center">
	<a alt="npm package page"
		href="https://www.npmjs.com/package/node-typescript-compiler">
		<img alt="npm badge"
			src="https://img.shields.io/npm/v/node-typescript-compiler.svg">
	</a>
	<a alt="dependencies analysis"
		href="https://david-dm.org/offirmo/offirmo-monorepo?path=4-tools%2Fnode-typescript-compiler">
		<img alt="dependencies badge"
			src="https://img.shields.io/david/offirmo/offirmo-monorepo.svg?path=4-tools%2Fnode-typescript-compiler">
	</a>
	<a alt="license"
		href="https://unlicense.org/">
		<img alt="license badge"
			src="https://img.shields.io/badge/license-public_domain-brightgreen.svg">
	</a>
		<img alt="maintenance status badge"
			src="https://img.shields.io/maintenance/yes/2022.svg">
</p>


Exposes the TypesScript compiler (tsc) as a node.js module

Allows you to invoke `tsc` from a node script.

This work trivially by [spawning](https://devdocs.io/node/child_process#child_process_child_process_spawn_command_args_options) `tsc`
from whenever it can be found, ideally a sibling `../node_modules/typescript` module.

**Example use case:** I'm using this to build several variants of my modules = node / browser, calling `tsc` with slight modifications of `target` and `lib`.

**Note to evaluators:** This module is solidly built (not a hack), it works in a straightforward and reliable way
and will properly catch and report any possible error.
Usage in production is thus possible.


## installation

**node-typescript-compiler** requires the **typescript module** as a sibling,
not included so you can choose your version.
(node-typescript-compiler will intelligently try
to locate another typescript install if it can't be found as a sibling.
This is not recommended)

```bash
npm i --save-dev typescript
npm i --save-dev node-typescript-compiler
```

Node requirements: **>=12** since this module is now [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
If needed, the older v3 should work for older node >=4. Not promising anything.


## Usage

***WARNING* You should have a working TypeScript setup with a `tsc`+`tsconfig.json` before using this tool.**
It'll be easier to know where the errors are from: your setup or this tool?


The module exposes a unique function, `compile({tscOptions}, [files], [{options}])`:
* `tscOptions` is a hashmap of [tsc options](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
  * Note: you're better re-using a `tsconfig.json` and using just `{ project: '.' }` to refer to it
* `files` is an optional array of files to compile, if not implied through `tscOptions` (force it to `undefined` if you need the 3rd param)
* `options` is an optional hash of:
  * `verbose: boolean` (default `false`) explain what's happening and display more detailed errors
  * `banner: string` (default `node-typescript-compiler:`) what is displayed as the first line of stdout


### Example invocation: Compile current project:

```js
import tsc from 'node-typescript-compiler'
await tsc.compile({
	'project': '.'
})
```
--> Will spawn `tsc --project .`

### Example invocation: Compile current project with some options overridden

```js
import tsc from 'node-typescript-compiler'
const tsconfig = { json: require('../tsconfig.json') }

await tsc.compile(
	{
		...tsconfig.json.compilerOptions,
		declaration: false,
		outDir: 'dist/es6.amd',
		module: 'amd'
	},
	tsconfig.json.files,
)
```
--> Will spawn `tsc <…non-overriden tsconfig options> --outDir dist/es6.amd --module amd`
 (boolean "false" values cause the corresponding option to not be added to the invocation string, this is the intended behaviour)

### Example invocation: Get help

```js
import tsc from 'node-typescript-compiler'

await tsc.compile({
	help: true
})
```
--> Will spawn `tsc --help` (boolean "true" values are not needed thus don't appear on the invocation string, option presence is enough)

### Usage notes

This module should be fairly stable.
Its behaviour is straightforward and all possible error cases should be caught.

This module will intelligently try to extract the error message from stdout/stderr if possible.

Output is forwarded, with a radix: `tsc>`

The output is monitored and on detection of an incremental recompilation,
a convenient separator will be displayed.

Also the `--listFiles` option should lead to a readable output.

This module *should* work on Windows thanks to using the [cross-spawn](https://www.npmjs.com/package/cross-spawn) package.
However this has NOT been tested personally by the author.

## Design considerations

It seems we could do that more elegantly and at a lower level by directly calling tsc code,
as explained here: https://basarat.gitbooks.io/typescript/content/docs/compiler/overview.html

However, that would take a lot of time and effort, and I'm afraid of API changes. So *no*.


## See also

https://www.npmjs.com/package/ntypescript but they have poor doc and don't allow choosing the typescript version (ex. using the unstable "next")
