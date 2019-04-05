
<h1 align="center">
	Offirmo’s Universal Debug API - no op implementation<br>
	<a href="https://www.offirmo.net/offirmo-monorepo/doc/modules-directory/index.html">
		<img src="https://www.offirmo.net/offirmo-monorepo/doc/quality-seal/offirmos_quality_seal.svg" alt="Offirmo’s quality seal">
	</a>
</h1>

<p align="center">
	<a alt="npm package page"
	  href="https://www.npmjs.com/package/@offirmo/universal-debug-api-minimal-noop">
		<img alt="npm badge"
		  src="https://img.shields.io/npm/v/@offirmo/universal-debug-api-minimal-noop.svg">
	</a>
	<a alt="dependencies analysis"
	  href="https://david-dm.org/offirmo/offirmo-monorepo?path=2-advanced%2Funiversal-debug-api-minimal-noop">
		<img alt="dependencies badge"
		  src="https://img.shields.io/david/offirmo/offirmo-monorepo.svg?path=2-advanced%2Funiversal-debug-api-minimal-noop">
	</a>
	<a alt="bundle size evaluation"
	  href="https://bundlephobia.com/result?p=@offirmo/universal-debug-api-minimal-noop">
		<img alt="bundle size badge"
		  src="https://img.shields.io/bundlephobia/minzip/@offirmo/universal-debug-api-minimal-noop.svg">
	</a>
	<a alt="license"
	  href="https://unlicense.org/">
		<img alt="license badge"
		  src="https://img.shields.io/badge/license-public_domain-brightgreen.svg">
	</a>
	<img alt="maintenance status badge"
	  src="https://img.shields.io/maintenance/yes/2019.svg">
</p>

**This is a minimal, no-operation implementation of [Offirmo’s Universal Debug API](https://github.com/Offirmo/offirmo-monorepo/wiki/Offirmo%E2%80%99s-Universal-Debug-Api).**

Isomorphic, for node and browser.

**In Chrome and Firefox, this no-op code can be magically hot-swapped with the companion [webextension](TODO)!**

See overall explanation: [Offirmo’s Universal Debug API](https://github.com/Offirmo/offirmo-monorepo/wiki/Offirmo%E2%80%99s-Universal-Debug-Api).


## Usage

Use this lib **to not bloat your webapp/npx bundle**. This no-op implementation will do nothing: display nothing, compute nothing.


```javascript
import { } from '@offirmo/universal-debug-api-minimal-noop'

TODO
```

Note: no bundled version provided, for this lib is targeted at lib authors, not end users.
