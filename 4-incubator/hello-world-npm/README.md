
<h1 align="center">
	Hello World Npm<br>
	<img src="../../doc/quality-seal/offirmos_quality_seal.svg" alt="Offirmo’s quality seal">
</h1>

<center>
[![npm (scoped)](https://img.shields.io/npm/v/hello-world-emo.svg)](https://www.npmjs.com/package/@offirmo/hello-world-emo)
![David (path)](https://img.shields.io/david/offirmo/offirmo-monorepo.svg?path=4-incubator%2Fhello-world-npm)
[![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/hello-world-emo.svg)](https://bundlephobia.com/result?p=hello-world-emo)
[![license](http://img.shields.io/badge/license-public_domain-brightgreen.svg)](http://unlicense.org/)
![Maintenance](https://img.shields.io/maintenance/yes/2019.svg)
</center>

A hello world npm module whose real purpose is to experiment a 'modern' (typescript / ES6)
module declaration and its consumption by various environments, including legacy.

This is an "emo" version, in reference to this article: [JavaScript Modules: Welcome to My Emo Hellscape](https://medium.com/@trek/last-week-i-had-a-small-meltdown-on-twitter-about-npms-future-plans-around-front-end-packaging-b424dd8d367a).

## installation

```sh
npm i --save hello-world-emo
```

Then in your code:
* node 6+ : `const { hello } = require('hello-world-emo')`
* node stable (4): `const hello = require('hello-world-emo').hello`
* node legacy (<4): `var hello = require('hello-world-emo/dist/index.node-legacy').hello`
* ES2015/ES6: `import { hello } from 'hello-world-emo'`
  * a "jsnext" entry is provided in package.json for rollup users, pointing to ES6 code
* typescript: `import { hello } from 'hello-world-emo'`
* browser
  * TODO

## Usage

```js
hello()           --> Hello, World :-(
hello('Offirmo')  --> Hello, Offirmo :-(
```
What did you expect ?


## Contributing
npm 3 is needed for installing deps (node >= 6)
```shell
rm -rf node_modules
npm i
```

tests (node >= 6)
```shell
npm run test:quick
npm run test:interactive
```

Then **switch back to the lowest non-legacy node we want to officially support** (earlier will be "legacy") for generating
```shell
nvm use 4
npm run build
```
Eventually, commit and release
```shell
npm run np -- patch
```


## Technical
This module is aiming at having optimal consumption by :
* node stable, latest and legacy
* browser: vanilla, requireJs, SystemJS...
* ES6
  * mainly for rollup tree-shaking (jsnext)
    * https://github.com/rollup/rollup
* typescript 1 & 2
  * https://www.typescriptlang.org/docs/handbook/modules.html
  * https://blog.oio.de/2014/01/31/an-introduction-to-typescript-module-system/
  * https://github.com/basarat/ts-npm-module-consume
  * http://stackoverflow.com/questions/12687779/how-do-you-produce-a-d-ts-typings-definition-file-from-an-existing-javascript
  * https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html


References :
* https://medium.com/@tarkus/how-to-build-and-publish-es6-modules-today-with-babel-and-rollup-4426d9c7ca71#.5pxa9u2l1
* https://ponyfoo.com/articles/why-i-write-plain-javascript-modules
* http://www.2ality.com/2015/12/bundling-modules-future.html
* https://www.smashingmagazine.com/2016/02/writing-next-generation-reusable-javascript-modules/
* https://medium.com/@mweststrate/how-to-create-strongly-typed-npm-modules-1e1bda23a7f4#.74ko6tal3
