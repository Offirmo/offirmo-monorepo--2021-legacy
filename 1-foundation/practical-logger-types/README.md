
<h1 align="center">
	Offirmo’s practical logger - TypeScript interfaces<br>
	<a href="https://www.offirmo.net/offirmo-monorepo/doc/modules-directory/index.html">
		<img src="https://www.offirmo.net/offirmo-monorepo/doc/quality-seal/offirmos_quality_seal.svg" alt="Offirmo’s quality seal">
	</a>
</h1>

<p align="center">
	<a alt="npm package page"
	  href="https://www.npmjs.com/package/@offirmo/practical-logger-types">
		<img alt="npm badge"
		  src="https://img.shields.io/npm/v/@offirmo/practical-logger-types.svg">
	</a>
	<a alt="dependencies analysis"
	  href="https://david-dm.org/offirmo/offirmo-monorepo?path=1-foundation%2Fpractical-logger-types">
		<img alt="dependencies badge"
		  src="https://img.shields.io/david/offirmo/offirmo-monorepo.svg?path=1-foundation%2Fpractical-logger-types">
	</a>
	<a alt="bundle size evaluation"
	  href="https://bundlephobia.com/result?p=@offirmo/practical-logger-types">
		<img alt="bundle size badge"
		  src="https://img.shields.io/bundlephobia/minzip/@offirmo/practical-logger-types.svg">
	</a>
	<a alt="license"
	  href="https://unlicense.org/">
		<img alt="license badge"
		  src="https://img.shields.io/badge/license-public_domain-brightgreen.svg">
	</a>
	<img alt="maintenance status badge"
	  src="https://img.shields.io/maintenance/yes/2019.svg">
</p>

This is an **internal** component of [Offirmo’s practical logger](https://github.com/Offirmo/offirmo-monorepo/wiki/Offirmo%E2%80%99s-Practical-Logger). 
* declares only TypeScript types
* **No code, 0 bytes** = will do nothing to your bundle size.


## Usage

**This is most likely not what you are looking for!**

See the actual implementations of those interfaces:
* minimal no-op: [@offirmo/practical-logger-minimal-noop](https://www.npmjs.com/package/@offirmo/practical-logger-minimal-noop)
* browser: [@offirmo/practical-logger-browser](https://www.npmjs.com/package/@offirmo/practical-logger-browser)
* node: [@offirmo/practical-logger-node](https://www.npmjs.com/package/@offirmo/practical-logger-node)

### Interface
A logger will have the following interface:
* `setLevel(level: LogLevel): void`
* `getLevel(): LogLevel`
* `addCommonDetails(hash: Readonly<{ [k: string]: any }>): void`
* Log primitives: (mirroring the log levels)
  * `fatal(message?: string, details?: Readonly<{ [k: string]: any }>): void`
  * `emerg(…) idem`
  * `alert(…) idem`
  * `crit(…) idem`
  * `error(…) idem`
  * `warning(…), warn(…) idem`
  * `notice(…) idem`
  * `info(…) idem`
  * `verbose(…) idem`
  * `log(…) idem`
  * `debug(…) idem`
  * `trace(…) idem`
  * `silly(…) idem`
* those functions are present but may not do anything (platform-dependent):
  * `group(groupTitle?: string): void` 
  * `groupCollapsed(groupTitle?: string): void`
  * `groupEnd(): void`


## Concept
Other loggers:
* http://getpino.io/#/docs/benchmarks
