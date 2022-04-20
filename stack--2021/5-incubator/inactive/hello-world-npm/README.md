
<h1 align="center">
	Hello World Npm<br>
	<a href="https://www.offirmo.net/offirmo-monorepo/0-doc/modules-directory/index.html">
		<img src="https://www.offirmo.net/offirmo-monorepo/0-doc/quality-seal/offirmos_quality_seal.svg" alt="Offirmo’s quality seal">
	</a>
</h1>

<p align="center">
	<a alt="npm package page"
		href="https://www.npmjs.com/package/hello-world-emo">
		<img alt="npm badge"
			src="https://img.shields.io/npm/v/hello-world-emo.svg">
	</a>
	<a alt="dependencies analysis"
		href="https://david-dm.org/offirmo/offirmo-monorepo?path=5-incubator%2Fhello-world-npm">
		<img alt="dependencies badge"
			src="https://img.shields.io/david/offirmo/offirmo-monorepo.svg?path=5-incubator%2Fhello-world-npm">
	</a>
	<a alt="bundle size evaluation"
		href="https://bundlephobia.com/result?p=hello-world-emo">
		<img alt="bundle size badge"
			src="https://img.shields.io/bundlephobia/minzip/hello-world-emo.svg">
	</a>
	<a alt="license"
		href="https://unlicense.org/">
		<img alt="license badge"
			src="https://img.shields.io/badge/license-public_domain-brightgreen.svg">
	</a>
		<img alt="maintenance status badge"
			src="https://img.shields.io/maintenance/yes/2020.svg">
</p>


A hello world npm module whose real purpose is to experiment a 'modern' (TypeScript / ES6)
module declaration and its consumption by various environments, including legacy.

This is an "emo" hello world, in reference to this article: [JavaScript Modules: Welcome to My Emo Hellscape](https://medium.com/@trek/last-week-i-had-a-small-meltdown-on-twitter-about-npms-future-plans-around-front-end-packaging-b424dd8d367a).

## Usage

```sh
npm i --save hello-world-emo
yarn add hello-world-emo
```

```js
import { hello } from 'hello-world-emo'

hello()           // --> Hello, World :-(
hello('Offirmo')  // --> Hello, Offirmo :-(
```
What did you expect ?


## Technical
This module is aiming at
* being modern in all ways
* having optimal consumption by :
  * node stable and latest
  * browser: vanilla, webpack, parcel, requireJs, SystemJS...
  * ES6
    * mainly for rollup tree-shaking (jsnext)
      * https://github.com/rollup/rollup
  * typescript latest
    * https://www.typescriptlang.org/docs/handbook/modules.html
    * https://blog.oio.de/2014/01/31/an-introduction-to-typescript-module-system/
    * https://github.com/basarat/ts-npm-module-consume
    * http://stackoverflow.com/questions/12687779/how-do-you-produce-a-d-ts-typings-definition-file-from-an-existing-javascript
    * https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html
* This module is intentionally using a third-party module to test that everything works

References :
* https://medium.com/@tarkus/how-to-build-and-publish-es6-modules-today-with-babel-and-rollup-4426d9c7ca71#.5pxa9u2l1
* https://ponyfoo.com/articles/why-i-write-plain-javascript-modules
* http://www.2ality.com/2015/12/bundling-modules-future.html
* https://www.smashingmagazine.com/2016/02/writing-next-generation-reusable-javascript-modules/
* https://medium.com/@mweststrate/how-to-create-strongly-typed-npm-modules-1e1bda23a7f4#.74ko6tal3
