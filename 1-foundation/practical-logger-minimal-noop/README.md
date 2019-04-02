
<h1 align="center">
	Offirmo’s practical logger - no op implementation<br>
	<a href="https://www.offirmo.net/offirmo-monorepo/doc/modules-directory/index.html">
		<img src="https://www.offirmo.net/offirmo-monorepo/doc/quality-seal/offirmos_quality_seal.svg" alt="Offirmo’s quality seal">
	</a>
</h1>

<p align="center">
	<a alt="npm package page"
	  href="https://www.npmjs.com/package/@offirmo/practical-logger-minimal-noop">
		<img alt="npm badge"
		  src="https://img.shields.io/npm/v/@offirmo/practical-logger-minimal-noop.svg">
	</a>
	<a alt="dependencies analysis"
	  href="https://david-dm.org/offirmo/offirmo-monorepo?path=1-foundation%2Fpractical-logger-minimal-noop">
		<img alt="dependencies badge"
		  src="https://img.shields.io/david/offirmo/offirmo-monorepo.svg?path=1-foundation%2Fpractical-logger-minimal-noop">
	</a>
	<a alt="bundle size evaluation"
	  href="https://bundlephobia.com/result?p=@offirmo/practical-logger-minimal-noop">
		<img alt="bundle size badge"
		  src="https://img.shields.io/bundlephobia/minzip/@offirmo/practical-logger-minimal-noop.svg">
	</a>
	<a alt="license"
	  href="https://unlicense.org/">
		<img alt="license badge"
		  src="https://img.shields.io/badge/license-public_domain-brightgreen.svg">
	</a>
	<img alt="maintenance status badge"
	  src="https://img.shields.io/maintenance/yes/2019.svg">
</p>

**This is a minimal, no-operation implementation of Offirmo’s practical logger.**

Use this lib if you want to provide a default implementation,
for example as a default value in a dependency injection mechanism,
ready to be replaced by an actual version if the caller wants it,
but not hurting the bundle size if the user opts out.
